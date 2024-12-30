import { loadFiles } from '@graphql-tools/load-files'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { combineResolvers } from 'graphql-resolvers'

const getTypes = async () => {
  const files = await loadFiles(`${__dirname}/**/types.graphql`)
  return mergeTypeDefs(files, { sort: true, throwOnConflict: true, ignoreFieldConflicts: false })
}

const getPermissions = async (): Promise<any> => {
  const files = await loadFiles(`${__dirname}/**/permissions.js`)
  return mergeResolvers(files)
}

const getBareResolvers = async (): Promise<any> => {
  const files = await loadFiles(`${__dirname}/**/resolvers.js`)
  return mergeResolvers(files)
}

const getResolvers = async () => {
  const [resolvers, permissions] = await Promise.all([
    getBareResolvers(), getPermissions(),
  ])
  // TODO: It's not checking for conflicts, library does not support it
  for (const type in permissions) {
    const props = permissions[type]
    if (!resolvers[type]) {
      resolvers[type] = {}
    }
    for (const prop in props) {
      const list = props[prop]
      if (resolvers[type][prop]) {
        // Prepend the array of resolvers to the handler (if any)
        list.push(resolvers[type][prop])
      } else {
        // Must add a resolver to explicitly return the value
        list.push((o: any) => o[prop])
      }
      resolvers[type][prop] = combineResolvers(...list)
    }
  }
  return resolvers
}

export async function loadSchema() {
  const [typeDefs, resolvers] = await Promise.all([getTypes(), getResolvers()])
  return makeExecutableSchema({ typeDefs, resolvers })
}

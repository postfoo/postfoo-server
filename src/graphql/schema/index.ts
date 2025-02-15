import { loadFiles } from '@graphql-tools/load-files'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { composeResolvers } from '@graphql-tools/resolvers-composition'
import { makeExecutableSchema } from '@graphql-tools/schema'

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

const resolversComposition = async () => {
  const permissions = await getPermissions()

  const ret: Record<string, any[]> = {}
  for (const type in permissions) {
    const props = permissions[type]
    for (const prop in props) {
      ret[`${type}.${prop}`] = props[prop]
    }
  }
  return ret
}

export async function loadSchema() {
  const actualResolvers = await getBareResolvers()
  const [typeDefs, resolvers] = await Promise.all([
    getTypes(),
    composeResolvers(actualResolvers, await resolversComposition()),
  ])
  return makeExecutableSchema({ typeDefs, resolvers })
}

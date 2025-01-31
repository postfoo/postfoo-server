import { User as SentryUser } from '@sentry/node'
import { FastifyInstance, FastifyRequest } from 'fastify'
import mercurius from 'mercurius'
import { loadSchema } from 'src/graphql/schema'
import * as model from 'src/models'
import { User } from 'src/types'
import * as jwt from 'src/utils/jwt'
import logger from 'src/utils/logger'
import sentry from 'src/utils/sentry'

const getContext = async (req: FastifyRequest) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  let jwtVal: jwt.Jwt | undefined
  let user: User | undefined
  if (token) {
    try {
      jwtVal = await jwt.verify(token)
      user = await model.user.get(jwtVal.sub)
    } catch (err) {
      logger.error(err)
      user = undefined
      jwtVal = undefined
    }
  }
  return {
    token,
    jwt: jwtVal,
    user,
  }
}

async function setup(app: FastifyInstance) {
  const schema = await loadSchema()

  app.register(mercurius, {
    schema,
    graphiql: process.env.MODE !== 'prod' ? true : false,
    path: '/api',
    context: getContext,
    errorFormatter: (execution, ...args) => {
      sentry.withScope(async (scope) => {
        const req = args[0].reply.request
        const { user } = await getContext(req)
        const gqlParams = req.body as { operationName?: string, variables?: Record<string, any>, query?: string }

        let sentryUser: SentryUser = { ip_address: req.ip }
        if (user) {
          sentryUser = { ...sentryUser, id: user.id, name: model.user.name(user), isSuperadmin: model.user.isSuperadmin(user) }
        }
        scope.setUser(sentryUser)

        scope.setTags({ 'graphql.name': gqlParams?.operationName || 'none' })
        scope.setExtra('query', gqlParams?.query)
        if (gqlParams?.variables) {
          scope.setContext('variables', gqlParams.variables)
        }

        if (execution.errors) {
          for (const err of execution.errors) {
            if (err.extensions) {
              // These are input validation errors and we don't want to track them as we know
              // many users will make mistakes in their input.
              continue
            }
            if (err.path) {
              scope.setTag('path', err.path.join('.'))
            }
            // scope.setTag('error.code', err.extensions?.code || err.name)
            scope.setExtra('error.message', err.message)
            sentry.captureException(err, scope)
          }
        }
      })
      return mercurius.defaultErrorFormatter(execution, ...args)
    }
  })

  await app.ready()
}

export default { setup }




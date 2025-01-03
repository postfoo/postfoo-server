import { fastifyRequestContext } from '@fastify/request-context'
import { FastifyInstance } from 'fastify'
import mercurius from 'mercurius'
import { loadSchema } from 'src/graphql/schema'
import * as model from 'src/models'
import { User } from 'src/types'
import * as jwt from 'src/utils/jwt'
import logger from 'src/utils/logger'

async function setup(app: FastifyInstance) {
  const schema = await loadSchema()

  app.register(fastifyRequestContext, {
    hook: 'onRequest',
    defaultStoreValues: {
      token: null,
      user: null,
      jwt: null,
    },
  })

  app.addHook('onRequest', (req, _reply, done) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (token) {
      jwt.verify(token)
        .then((jwt) => {
          // If user is not found, the promise will throw an error
          model.user.get(jwt.sub)
            .then((user) => {
              req.requestContext.set('user', user)
              req.requestContext.set('token', token)
              req.requestContext.set('jwt', jwt)
            })
            .catch((err) => {
              logger.error(err)
              req.requestContext.set('user', null)
              req.requestContext.set('token', null)
              req.requestContext.set('jwt', null)
            })
            .finally(() => {
              done()
            })
        })
        .catch((err) => {
          logger.error(err)
          req.requestContext.set('user', null)
          req.requestContext.set('token', null)
          req.requestContext.set('jwt', null)
          done()
        })
    }
    done()
  })

  app.register(mercurius, {
    schema,
    graphiql: process.env.MODE !== 'prod' ? true : false,
    path: '/api',
    context: async (req) => {
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
    },
  })
}

export default { setup }



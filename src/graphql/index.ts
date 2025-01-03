import { FastifyInstance } from 'fastify'
import mercurius from 'mercurius'
import { loadSchema } from 'src/graphql/schema'
import * as model from 'src/models'
import { User } from 'src/types'
import * as jwt from 'src/utils/jwt'
import logger from 'src/utils/logger'

async function setup(app: FastifyInstance) {
  const schema = await loadSchema()

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



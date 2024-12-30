import { FastifyInstance } from 'fastify';
import mercurius from 'mercurius';
import { loadSchema } from 'src/graphql/schema';

async function setup(app: FastifyInstance) {
  const schema = await loadSchema()

  app.register(mercurius, {
    schema,
    graphiql: process.env.MODE !== 'prod' ? true : false,
    path: '/api',
  })
}

export default { setup }



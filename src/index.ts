import 'module-alias/register'

import fastify from 'fastify'
import mercurius from 'mercurius'
import logger from 'src/utils/logger'
import pkg from 'src/utils/pkg'

const app = fastify({
  logger: true,
  ignoreTrailingSlash: true,
})

app.get('/', (_req, res) => {
  res.send('OK')
})

const schema = `
  type Query {
    add(x: Int, y: Int): Int
  }
`

const resolvers = {
  Query: {
    add: async (_: any, { x, y }: { x: number; y: number }) => x + y
  }
}

app.register(mercurius, {
  schema,
  resolvers
})

app.get('/api', async function (_req, reply) {
  const query = '{ add(x: 2, y: 2) }'
  return reply.graphql(query)
})

const main = async () => {
  try {
    const port = process.env.PORT ? Number(process.env.PORT) : 4000

    // 0.0.0.0 is the default host for Docker
    app.listen({ port, host: '0.0.0.0' })
    const elapsed = process.uptime().toFixed(1)
    console.log(`🚀 Server ready at http://localhost:${port}`)
    logger.info(`${process.env.ENV} ${pkg.name}@${pkg.version} ready at ${port} in ${elapsed}s`)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('beforeExit', () => {
  app.close()
})

main()

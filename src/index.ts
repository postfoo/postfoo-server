import 'module-alias/register'

import cors from '@fastify/cors'
import fastify from 'fastify'
import db from 'src/db'
import graphql from 'src/graphql'
import logger from 'src/utils/logger'
import pkg from 'src/utils/pkg'

const app = fastify({
  logger: true,
  ignoreTrailingSlash: true,
})

app.get('/', (_req, res) => {
  res.send('OK')
})

app.get('/health', async (_req) => {
  // health check the DB too
  await db.$queryRawUnsafe('SELECT 1')
  return {
    statusCode: 200,
    RELEASE: process.env.RELEASE || '',
    RELEASE_AT: process.env.RELEASE_AT || '',
  }
})

app.register(cors, {
  // Prod access only from main domain
  origin: process.env.MODE === 'prod' ? [/\.postfoo\.com$/] : '*',
})

const main = async () => {
  try {
    const port = process.env.PORT ? Number(process.env.PORT) : 4000
    await db.$connect()

    await graphql.setup(app)
    // 0.0.0.0 is the default host for Docker
    app.listen({ port, host: '0.0.0.0' })
    const elapsed = process.uptime().toFixed(1)
    logger.info(`🚀  ${process.env.MODE || 'dev'} ${pkg.name}@${pkg.version} ready at ${port} in ${elapsed}s`)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('beforeExit', () => {
  app.close()
  db.$disconnect()
})

main()

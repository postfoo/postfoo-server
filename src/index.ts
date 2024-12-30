import 'module-alias/register'

import fastify from 'fastify'
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

const main = async () => {
  try {
    const port = process.env.PORT ? Number(process.env.PORT) : 4000

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
})

main()

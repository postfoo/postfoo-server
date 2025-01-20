import 'module-alias/register'

import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import fastify, { FastifyRequest } from 'fastify'
import db from 'src/db'
import graphql from 'src/graphql'
import { honeypot } from 'src/utils/honeypot'
import logger from 'src/utils/logger'
import pkg from 'src/utils/pkg'
const app = fastify({
  logger: true,
  ignoreTrailingSlash: true,
  trustProxy: true,
})

app.addHook('onSend', (_req, reply, _payload, done) => {
  reply
    .headers({
      'X-Server-Release': process.env.RELEASE,
      'X-Server-Release-At': process.env.RELEASE_AT,
      'X-Server-Mode': process.env.MODE,
    })
  done()
})

app.get('/', (_req, reply) => {
  reply.send('OK')
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

app.get('/get-honeypot-inputs', async (_req, reply) => {
  reply.send({
    honeypot: await honeypot.getInputProps(),
  })
})

app.register(cors, {
  // TODO: Prod access only from main domain
  origin: '*', // process.env.MODE === 'prod' ? ['.postfoo.com', 'postfoo.com'] : '*',
})

// When running tests or running in development, we want to effectively disable
// rate limiting because playwright tests are very fast and we don't want to
// have to wait for the rate limit to reset between tests.
const maxMultiple = !(process.env.MODE === 'prod') || process.env.PLAYWRIGHT_TEST_BASE_URL ? 10_000 : 1

const generalRateLimit = {
  global: true,
  timeWindow: 60 * 1000,
  max: 1000 * maxMultiple,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  // Malicious users can spoof their IP address which means we should not deault
  // to trusting req.ip.
  keyGenerator: (req: FastifyRequest) => {
    const ip = req.headers['DO-Connecting-IP'] // digital ocean
      || req.headers['cf-connecting-ip'] // cloudflare
      || req.headers['fly-client-ip'] // fly.io
      || req.headers['Fastly-Client-Ip']
      || req.headers['X-Cluster-Client-IP']
      || req.headers['"X-Client-IP"']
      || req.headers['x-real-ip'] // nginx
      || req.headers['x-client-ip'] // apache
      || req.headers['x-forwarded-for'] // use this only if you trust the header
      || req.socket.remoteAddress // fallback to default
      || req.ip // fallback to default
    if (ip) {
      if (typeof ip === 'string') {
        return ip.split(',').pop()?.trim() || 'unknown'
      }
      return ip.pop()?.trim() || 'unknown'
    }
    return 'unknown'
  },
}

/*
TODO:: Add rate limiting for operations by using query params:
https://github.com/fastify/fastify-rate-limit/issues/408

const strongRateLimit = {
  ...generalRateLimit,
  global: false,
  timeWindow: 60 * 1000,
  max: 100 * maxMultiple,
}

const strongestRateLimit = {
  ...generalRateLimit,
  global: false,
  timeWindow: 60 * 1000,
  max: 10 * maxMultiple,
}

const strongestOperations = ['verifyCode', 'resendCode', 'signIn', 'signUp', 'forgotPassword', 'resetPassword']
const strongOperations = ['create', 'update', 'delete']
*/

const main = async () => {
  try {
    await app.register(rateLimit, generalRateLimit)
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

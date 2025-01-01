import { PrismaClient } from '@prisma/client'

const db = new PrismaClient({
  log: [{ level: 'query', emit: 'stdout' }],
  errorFormat: 'colorless',
  datasources: { db: { url: process.env.DATABASE_URL } },
})

export default db

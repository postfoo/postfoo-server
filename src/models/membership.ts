import { UserRole } from '@prisma/client'
import db from 'src/db'
import { whereId } from 'src/models/core'


export const get = (entity: string) => {
  return db.membership.findUniqueOrThrow(whereId(entity))
}

export const isMember = (userId: string, portfolioId: string) => {
  return db.membership.findFirst({ where: { userId, portfolioId } })
}

export const isAdmin = (userId: string, portfolioId: string) => {
  return db.membership.findFirst({ where: { userId, portfolioId, role: UserRole.Admin } })
}

import db from 'src/db'
import { whereId } from 'src/models/core'

export const get = (entity: string) => {
  return db.code.findUniqueOrThrow(whereId(entity))
}

export const byUserId = (userId: string) => {
  return db.code.findMany({ where: { userId } })
}

export const deleteByUserId = (userId: string) => {
  return db.code.deleteMany({ where: { userId } })
}

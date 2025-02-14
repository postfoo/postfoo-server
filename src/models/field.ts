import db from 'src/db'
import { whereId } from 'src/models/core'

export const get = (entity: string) => {
  return db.field.findUniqueOrThrow(whereId(entity))
}

export const find = (portfolioId: string, name?: string) => {
  if (name) {
    return db.field.findMany({ where: { portfolioId, name } })
  }
  return db.field.findMany({ where: { portfolioId } })
}

export const getByPortfolioId = (portfolioId: string) => {
  return db.field.findMany({ where: { portfolioId } })
}

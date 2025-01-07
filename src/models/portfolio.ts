import db from 'src/db'
import { whereId } from 'src/models/core'

export const get = (entity: string) => {
  return db.portfolio.findUniqueOrThrow(whereId(entity))
}

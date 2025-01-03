import { isString } from 'lodash'
import { Node } from 'src/types'
import * as errors from 'src/utils/errors'

export type IdOrNode = string | Pick<Node, 'id'>

export const getId = (entity: IdOrNode): string => {
  if (!entity) {
    throw errors.badInput('Received empty id to fetch')
  }
  return isString(entity) ? entity : entity.id
}

export const whereId = (entity: string) => {
  return { where: { id: getId(entity) } }
}

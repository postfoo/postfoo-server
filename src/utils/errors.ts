/** We encapsulate all errors here, specially GraphQL ones */

import { GraphQLError } from 'graphql'
import _ from 'lodash'
import { ErrorCode } from 'src/types/graphql'

export const error = (msg: string, code: ErrorCode | string) => {
  const err = new Error(msg)
  Object.defineProperty(err, 'name', { value: code })
  Error.captureStackTrace(err, Error)
  return err
}

export const isError = (err: any): err is Error => {
  return _.isError(err) && 'extensions' in err
}

export const badInput = (msg = 'The request is malformed') => (
  error(msg, ErrorCode.BAD_USER_INPUT)
)

export const unauthenticated = (msg = 'You must sign in first') => (
  error(msg, ErrorCode.UNAUTHENTICATED)
)

export const forbidden = (msg = 'You are not allowed to access this resource') => (
  error(msg, ErrorCode.FORBIDDEN)
)

export const notFoundRaw = (msg = 'Entity not found') => (
  error(msg, ErrorCode.NOT_FOUND)
)

export const notFound = (type: string, id?: string) => (
  notFoundRaw(`No ${type} found${id ? ` with id = "${id}"` : ''}`)
)

export const unknown = (msg = 'An unknown error ocurred') => (
  error(msg, ErrorCode.INTERNAL_SERVER_ERROR)
)

export const conflict = (msg = 'The value is incompatible') => (
  error(msg, ErrorCode.CONFLICT)
)

export const locked = (msg = 'This entity is locked') => (
  error(msg, ErrorCode.LOCKED)
)

export const methodNotAllowed = (msg = 'You are not allowed to perform this operation') => (
  error(msg, ErrorCode.METHOD_NOT_ALLOWED)
)

export const tooManyRequests = (msg = 'Please try this again later') => (
  error(msg, ErrorCode.TOO_MANY_REQUESTS)
)

export const invalidInput = (fieldName: string, message: string) => {
  return new GraphQLError(message, {
    extensions: {
      code: 'BAD_USER_INPUT',
      fieldName,
    },
  })
}

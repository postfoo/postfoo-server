import jwt from 'jsonwebtoken'
import moment, { DurationInputObject } from 'moment'
import { handleCallback } from 'src/utils/utils'

// which environment issued the token, TODO:: Probably add URL?
const ISSUER = process.env.MODE
const EXPIRY_DURATION: DurationInputObject = { days: 7 }
const ALGORITHM = 'ES256'

export enum Audience {
  Session = 'session',
}

export interface Jwt {
  sub: string,
  aud: Audience,
}

export const sign = (claims: Jwt, expiry: DurationInputObject | undefined = EXPIRY_DURATION) => {
  const authKey = process.env.AUTH_PRIVATE_KEY
  if (!authKey) {
    throw new Error('AUTH_PRIVATE_KEY is not set')
  }
  const { promise, callback } = handleCallback<any>()
  jwt.sign(claims, authKey, {
    algorithm: ALGORITHM,
    expiresIn: moment.duration(expiry).asSeconds(),
    issuer: ISSUER,
  }, callback)
  return promise
}

export const verify = (token: string, options?: jwt.VerifyOptions): Promise<Jwt> => {
  const authKey = process.env.AUTH_PUBLIC_KEY
  if (!authKey) {
    throw new Error('AUTH_PUBLIC_KEY is not set')
  }
  const { promise, callback } = handleCallback<any>()
  jwt.verify(token, authKey, {
    ...options, issuer: ISSUER, algorithms: [ALGORITHM],
  }, callback)
  return promise
}

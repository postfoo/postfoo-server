import crypto from 'crypto'
import _ from 'lodash'
import moment, { DurationInputObject } from 'moment'
import otpGenerator from 'otp-generator'

export const canonicalMobile = (mobile: string): string => {
  return mobile.replace(/\s/g, '')
}

export const generateOtp = () => {
  return Number(otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false }))
}

// Affects both the password and salt
const PASSWORD_LENGTH = 64
// Must be a power of 2
const PASSWORD_COST = 2 ** 15
const MAX_MEM = PASSWORD_COST * 2048
const PASSWORD_ENCODING: BufferEncoding = 'base64'

export const generateSalt = async () => {
  const { promise, callback } = handleCallback<Buffer>()
  crypto.randomBytes(PASSWORD_LENGTH, callback)
  return (await promise).toString(PASSWORD_ENCODING)
}

export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const { promise, callback } = handleCallback<Buffer>()
  crypto.scrypt(password, salt, PASSWORD_LENGTH, { cost: PASSWORD_COST, maxmem: MAX_MEM }, callback)
  return (await promise).toString(PASSWORD_ENCODING)
}

export const comparePassword = async (password: string, salt: string, expected: string): Promise<boolean> => {
  const hashed = await hashPassword(password, salt)
  // Protect against timing attacks
  const a = Buffer.from(hashed, PASSWORD_ENCODING)
  const b = Buffer.from(expected, PASSWORD_ENCODING)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/** Similar to lodash cloneDeep but with stronger typing. Ensure a potential Readonly is removed in the return type */
export const cloneDeep = <T>(obj: T | Readonly<T>): T => {
  return structuredClone(obj)
}

interface PromiseExtra<T> extends Promise<T> { resolve: (value: T) => void, reject: (reason?: any) => void }

export const promise = <T>(): PromiseExtra<T> => {
  let extra: Pick<PromiseExtra<T>, 'resolve' | 'reject'>
  const promise = new Promise<T>((resolve, reject) => {
    extra = { resolve, reject }
  })
  // @ts-expect-error Extra is being used before it is assigned any value
  return _.extend(promise, extra)
}

/** Returns a promise and a callback that resolves it, to promisify any callback-based function */
export const handleCallback = <T>() => {
  const prom = promise<T>()
  return {
    promise: prom as Promise<T>,
    callback: (err?: Error | null, res?: T) => {
      if (res) {
        prom.resolve(res)
      } else {
        prom.reject(err)
      }
    },
  }
}

export const toMS = (duration?: DurationInputObject): number => {
  return moment.duration(duration).asMilliseconds()
}

export const removeTrailingSlash = (path: string) => {
  return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path
}

export const delay = (ms: number | DurationInputObject): Promise<void> => {
  const time = _.isObject(ms) ? toMS(ms) : ms
  return new Promise(resolve => setTimeout(resolve, time))
}

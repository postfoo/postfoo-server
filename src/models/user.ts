import { keyBy } from 'lodash'
import { planPermissions } from 'src/data/plans'
import db from 'src/db'
import { whereId } from 'src/models/core'
import { SubscriptionPlan, User, UserStatus } from 'src/types'
import * as errors from 'src/utils/errors'
import * as jwt from 'src/utils/jwt'
import { canonicalMobile } from 'src/utils/utils'

export const get = (entity: string) => {
  return db.user.findUniqueOrThrow(whereId(entity))
}

export const getSafe = (entity: string) => {
  return db.user.findUnique(whereId(entity))
}

export const byMobile = (mobile: string) => {
  return db.user.findUnique({ where: { mobile: canonicalMobile(mobile) } })
}

export const verifyUser = async (userId: string) => {
  await db.user.update({ where: { id: userId }, data: { isVerified: true } })
}

const planPermissionsMap = keyBy(planPermissions, p => p.id)
export const activeSubscription = async (userId: string) => {
  const subscription = await db.subscription.findFirst({
    where: { userId, endDate: { lt: new Date() } },
  })
  return planPermissionsMap[subscription?.plan || SubscriptionPlan.BASIC]
}

export const fromJwt = async (claims?: jwt.Jwt): Promise<User | undefined> => {
  if (claims && claims.sub && claims.aud === jwt.Audience.Session) {
    try {
      const user = await get(claims.sub)
      return user
    } catch {
      // Can also happen when DB is reset and the client sends a JWT for an old user
      throw errors.unauthenticated('The session token is no longer valid')
    }
  }
}

export const isSuperadmin = (user: User) => {
  return user.status === UserStatus.Superadmin
}

/** Extracts a full name out of a user */
export const name = (user: { firstName: string, lastName?: string | null }): string => (
  user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName
)

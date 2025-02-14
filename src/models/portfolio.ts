import { keyBy } from 'lodash'
import { planPermissions } from 'src/data/plans'
import db from 'src/db'
import { whereId } from 'src/models/core'
import { activeSubscription as activeUserSubscription } from 'src/models/user'
import { SubscriptionPlan, UserRole } from 'src/types'

export const get = (entity: string) => {
  return db.portfolio.findUniqueOrThrow(whereId(entity))
}


const planPermissionsMap = keyBy(planPermissions, p => p.id)
export const activeSubscription = async (portfolioId: string) => {
  // If portfolio exists.
  await get(portfolioId)

  const members = await db.membership.findMany({ where: { portfolioId, role: UserRole.Admin } })
  // Not possiblem portfolio will always have a admin.
  // TODO:: We are going to support multiple admins in future.
  if (members.length > 0) {
    const user = members[0].userId
    return await activeUserSubscription(user)
  }
  return planPermissionsMap[SubscriptionPlan.BASIC]
}

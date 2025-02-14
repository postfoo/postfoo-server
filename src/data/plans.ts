import { Plan, PlanPermission, SubscriptionPlan } from 'src/types'

export const plans: Plan[] = [
  {
    id: SubscriptionPlan.BASIC,
    title: 'Basic',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Good to get you started for trying out the features',
    features: ['Create one portfolio', 'Add max 5 funds', 'Add max 30 current stocks', 'Add 1 PPF/NPS...etc.', 'Limited financial info supported'],
    popular: false,
  },
  {
    id: SubscriptionPlan.PRO,
    title: 'Pro',
    monthlyPrice: 100,
    yearlyPrice: 1000,
    description: 'Perfect when you are serious & have small to medium portfolio amongst family members',
    features: ['Create 5 portfolios', 'Add 15 funds', 'Add 100 stocks', 'Add 2 PPF/NPS...each.', 'More financial info supported', 'Share with 2 family members'],
    popular: true,
  },
  {
    id: SubscriptionPlan.ADVANCED,
    title: 'Advanced',
    monthlyPrice: 160,
    yearlyPrice: 1600,
    description: 'Best when you have large portfolios for all members of your family',
    features: ['Create 10 portfolios', 'Add 30 funds', 'Add 200 stocks', 'Add 10 PPF/NPS...each.', 'More financial info supported', 'Add 5 family members', 'Upload files'],
    popular: false,
  },
]

export const planPermissions: Record<SubscriptionPlan, PlanPermission> = {
  [SubscriptionPlan.BASIC]: {
    portfolios: 1,
    funds: 5,
    stocks: 30,
    // ppf, epf, nps, etc.
    schemes: 1,
    familyMembers: 0,
    uploadFiles: false,
  },
  [SubscriptionPlan.PRO]: {
    portfolios: 5,
    funds: 15,
    stocks: 100,
    // ppf, epf, nps, etc.
    schemes: 2,
    familyMembers: 2,
    uploadFiles: false,
  },
  [SubscriptionPlan.ADVANCED]: {
    portfolios: 10,
    funds: 30,
    stocks: 200,
    // ppf, epf, nps, etc.
    schemes: 10,
    familyMembers: 5,
    uploadFiles: true,
  },
}

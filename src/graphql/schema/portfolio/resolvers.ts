import { Prisma, UserRole } from '@prisma/client'
import db from 'src/db'
import * as model from 'src/models'
import { Resolvers } from 'src/types/resolvers'
import * as errors from 'src/utils/errors'

const resolvers: Resolvers = {
  Query: {
    portfolio: async (_, args, _ctx) => {
      return await model.portfolio.get(args.portfolioId)
    },
  },
  Mutation: {
    createPortfolio: async(_, args, ctx) => {
      const { name, description } = args.input
      const userId = ctx.user.id
      const count = await db.portfolio.count({ where: { members: { some: { userId } } } })
      const activeSubscription = await model.user.activeSubscription(userId)
      if (count >= activeSubscription.portfolios) {
        throw errors.invalidInput('general', 'You have reached the maximum number of allowed portfolios in your plan.')
      }
      return db.portfolio.create({ data: {
        name,
        description,
        members: { create: { userId, role: UserRole.Admin } },
      }, include: { members: true } })
    },
    updatePortfolio: async (_root, args, _ctx) => {
      const { portfolioId, ...changes } = args.input
      const data: Prisma.PortfolioUncheckedUpdateInput = changes

      // Check if the portfolio exists
      await model.portfolio.get(portfolioId)

      return db.portfolio.update({ where: { id: portfolioId }, data })
    },
    deletePortfolio: async (_root, args, _ctx) => {
      const { portfolioId } = args.input
      // Check if the portfolio exists
      await model.portfolio.get(portfolioId)
      await db.portfolio.delete({ where: { id: portfolioId } })
      return {}
    },
  },
  Portfolio: {
    members: portfolio => model.portfolio.get(portfolio.id).members({ orderBy: { role: 'desc', createdAt: 'asc' } }),
  },
}

export default resolvers

import db from 'src/db'
import * as model from 'src/models'
import { Resolvers } from 'src/types/resolvers'
import * as errors from 'src/utils/errors'

const resolvers: Resolvers = {
  Query: {
    portfolioFund: async (_, args, _ctx) => {
      return await model.portfolioFund.get(args.portfolioFundId)
    },
    portfolioFunds: async (_, args, _ctx) => {
      const { page, portfolioId } = args.input || {}

      const where = { portfolioId }
      const [nodes, total] = await Promise.all([
        db.portfolioFund.findMany({ ...model.prisma.mapPageInput(page, 10), orderBy: { fund: { name: 'asc' } }, where }),
        db.portfolioFund.count({ where }),
      ])
      return model.prisma.paginateList(nodes, page, total)
    },
  },
  Mutation: {
    createPortfolioFund: async (_, args, ctx) => {
      const { portfolioId, fundId, units, cost } = args.input
      // check if the portfolio exists
      await model.portfolio.get(portfolioId)
      // check if the fund exists
      await model.fund.get(fundId)

      const count = await db.portfolioFund.count({ where: { portfolioId } })
      const activeSubscription = await model.user.activeSubscription(ctx.user.id)
      if (count >= activeSubscription.funds) {
        throw errors.invalidInput('general', 'You have reached the maximum number of allowed funds in your plan.')
      }

      return db.portfolioFund.create({ data: { units, cost, portfolioId, fundId } })
    },
    updatePortfolioFund: async (_, args, _ctx) => {
      const { portfolioFundId, units, cost } = args.input
      // check if the portfolio fund exists
      await model.portfolioFund.get(portfolioFundId)

      return db.portfolioFund.update({ where: { id: portfolioFundId }, data: { units, cost } })
    },
    deletePortfolioFund: async (_, args, _ctx) => {
      const { portfolioFundId } = args.input
      // check if the portfolio fund exists
      await model.portfolioFund.get(portfolioFundId)

      db.portfolioFund.delete({ where: { id: portfolioFundId } })
      return {}
    },
  },
  PortfolioFund: {
    fund: portfolioFund => model.fund.get(portfolioFund.fundId),
    portfolio: portfolioFund => model.portfolio.get(portfolioFund.portfolioId),
  },
}

export default resolvers

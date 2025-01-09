import db from 'src/db'
import * as model from 'src/models'
import { Resolvers } from 'src/types/resolvers'

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
  PortfolioFund: {
    fund: portfolioFund => model.fund.get(portfolioFund.fundId),
    portfolio: portfolioFund => model.portfolio.get(portfolioFund.portfolioId),
  },
}

export default resolvers

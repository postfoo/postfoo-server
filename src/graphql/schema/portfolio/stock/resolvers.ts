import db from 'src/db'
import * as model from 'src/models'
import { Resolvers } from 'src/types/resolvers'
import * as errors from 'src/utils/errors'

const resolvers: Resolvers = {
  Query: {
    portfolioStock: async (_, args, _ctx) => {
      return await model.portfolioStock.get(args.portfolioStockId)
    },
    portfolioStocks: async (_, args, _ctx) => {
      const { page, portfolioId } = args.input || {}

      const where = { portfolioId }
      const [nodes, total] = await Promise.all([
        db.portfolioStock.findMany({ ...model.prisma.mapPageInput(page, 10), orderBy: { stock: { name: 'asc' } }, where }),
        db.portfolioStock.count({ where }),
      ])
      return model.prisma.paginateList(nodes, page, total)
    },
  },
  Mutation: {
    createPortfolioStock: async (_, args, ctx) => {
      const { portfolioId, stockId, units, cost } = args.input
      // check if the portfolio exists
      await model.portfolio.get(portfolioId)
      // check if the stock exists
      await model.stock.get(stockId)

      const count = await db.portfolioStock.count({ where: { portfolioId } })
      const activeSubscription = await model.user.activeSubscription(ctx.user.id)
      if (count >= activeSubscription.stocks) {
        throw errors.invalidInput('general', 'You have reached the maximum number of allowed stocks in your plan.')
      }

      return db.portfolioStock.create({ data: { units, cost, portfolioId, stockId } })
    },
    updatePortfolioStock: async (_, args, _ctx) => {
      const { portfolioStockId, units, cost } = args.input
      // check if the portfolio stock exists
      await model.portfolioStock.get(portfolioStockId)

      return db.portfolioStock.update({ where: { id: portfolioStockId }, data: { units, cost } })
    },
    deletePortfolioStock: async (_, args, _ctx) => {
      const { portfolioStockId } = args.input
      // check if the portfolio stock exists
      await model.portfolioStock.get(portfolioStockId)

      db.portfolioStock.delete({ where: { id: portfolioStockId } })
      return {}
    },
  },
  PortfolioStock: {
    stock: portfolioStock => model.stock.get(portfolioStock.stockId),
    portfolio: portfolioStock => model.portfolio.get(portfolioStock.portfolioId),
  },
}

export default resolvers

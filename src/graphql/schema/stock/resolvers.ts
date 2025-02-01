import db from 'src/db'
import * as model from 'src/models'
import { Resolvers } from 'src/types/resolvers'

const resolvers: Resolvers = {
  Query: {
    stock: async (_, args, _ctx) => {
      return await model.stock.get(args.stockId)
    },
    stocks: async (_, args, _ctx) => {
      const { page } = args.input || {}

      const where = model.filter.stocks(args.input)
      const [nodes, total] = await Promise.all([
        db.stock.findMany({ ...model.prisma.mapPageInput(page, 10), orderBy: { name: 'asc' }, where }),
        db.stock.count({ where }),
      ])
      return model.prisma.paginateList(nodes, page, total)
    },
  },
}

export default resolvers

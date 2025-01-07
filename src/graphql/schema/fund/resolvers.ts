import db from 'src/db'
import * as model from 'src/models'
import { Resolvers } from "src/types/resolvers"

const resolvers: Resolvers = {
  Query: {
    fund: async (_, args, _ctx) => {
      return await model.fund.get(args.fundId)
    },
    funds: async (_, args, _ctx) => {
      const { page } = args.input || {}

      const where = model.filter.funds(args.input)
      const [nodes, total] = await Promise.all([
        db.fund.findMany({ ...model.prisma.mapPageInput(page, 10), orderBy: { name: 'asc' }, where }),
        db.fund.count({ where }),
      ])
      return model.prisma.paginateList(nodes, page, total)
    },
  },
}

export default resolvers

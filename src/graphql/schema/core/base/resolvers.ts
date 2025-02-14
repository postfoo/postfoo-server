import { planPermissions, plans } from 'src/data/plans'
import { Resolvers } from 'src/types/resolvers'

const resolvers: Resolvers = {
  Query: {
    plans: (_, _args, _ctx) => {
      return {
        plans,
        planPermissions
      }
    },
  },
}

export default resolvers

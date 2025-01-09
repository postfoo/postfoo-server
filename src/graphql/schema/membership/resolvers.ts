import * as model from 'src/models'
import { Resolvers } from 'src/types/resolvers'

const resolvers: Resolvers = {
  Membership: {
    portfolio: membership => model.portfolio.get(membership.portfolioId),
    user: membership => model.user.get(membership.userId),
  },
}

export default resolvers

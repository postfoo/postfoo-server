import * as model from 'src/models'
import { Resolvers } from 'src/types/resolvers'

const resolvers: Resolvers = {
  User: {
    name: user => model.user.name(user),
    token: (user, _args, _ctx) => {
      return model.auth.sessionToken(user, undefined, { })
    },
    memberships: user => model.user.get(user.id).memberships({ orderBy: { createdAt: 'asc' } }),
  },
}

export default resolvers

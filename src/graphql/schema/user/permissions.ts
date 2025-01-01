import * as checks from 'src/graphql/checks'
import { Permissions } from 'src/types'

const permissions: Permissions = {
  Mutation: {
    // Todo: add captcha verify & throtttle
    signUp: [checks.isNotSignedIn, checks.mobileIsAvailable],
  },
  User: {
    token: [checks.isMe],
  },
}

export default permissions

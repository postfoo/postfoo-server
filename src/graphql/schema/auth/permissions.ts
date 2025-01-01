import * as checks from 'src/graphql/checks'
import { Permissions } from 'src/types'

const permissions: Permissions = {
  Mutation: {
    resendCode: [checks.isNotSignedIn],
    verifyCode: [checks.isNotSignedIn],
    signIn: [checks.isNotSignedIn],
  },
}

export default permissions

import * as checks from 'src/graphql/checks'
import { Permissions } from 'src/types'

const permissions: Permissions = {
  Mutation: {
    resendCode: [checks.isNotSignedIn],
    verifyCode: [checks.isNotSignedIn],
    signIn: [checks.isNotSignedIn],
    // Todo: add captcha verify & throtttle
    signUp: [checks.isNotSignedIn, checks.mobileIsAvailable],
  },
}

export default permissions

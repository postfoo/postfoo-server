import * as checks from 'src/graphql/checks'

const permissions = {
  Mutation: {
    resendCode: [checks.isNotSignedIn()],
    verifyCode: [checks.isNotSignedIn()],
    signIn: [checks.isNotSignedIn()],
    forgotPassword: [checks.isNotSignedIn()],
    resetPassword: [checks.isNotSignedIn()],
    // Todo: add captcha verify & throtttle
    signUp: [checks.isNotSignedIn(), checks.mobileIsAvailable()],
  },
}

export default permissions

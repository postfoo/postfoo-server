import moment from 'moment'
import db from 'src/db'
import { getInput, mobileIsAvailable } from 'src/graphql/checks'
import { sms } from 'src/integrations/messages'
import { UserStatus } from 'src/types'
import { Resolvers } from 'src/types/resolvers'
import { generateOtp, generateSalt, hashPassword } from 'src/utils/utils'

const resolvers: Resolvers = {
  Mutation: {
    signUp: async (root, args, ctx) => {
      const { mobile, password, firstName, lastName } = getInput(args)
      await mobileIsAvailable(root, { mobile }, ctx)
      const salt = await generateSalt()
      const hasedPassword = await hashPassword(password, salt)
      const user = await db.user.create({
        data: {
          firstName,
          lastName,
          mobile,
          password: hasedPassword,
          salt,
          isVerified: false,
          status: UserStatus.User,
          isBlocked: false,
        },
      })

      // lets send a verification code to the user over SMS
      const code = generateOtp()
      await db.code.create({
        data: {
          code: code.toString(),
          userId: user.id,
          // 5 minutes
          expireAt: moment(new Date(Date.now() + 60 * 5)).utc().toDate(),
        },
      })
      await sms(mobile, `${code} is your verification code for PostFoo`)
      return user
    },
  }
}

export default resolvers

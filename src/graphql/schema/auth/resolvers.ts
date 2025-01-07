import moment from 'moment'
import db from 'src/db'
import { getInput } from 'src/graphql/checks'
import { sms } from 'src/integrations/messages'
import * as model from 'src/models'
import { MutationResendCodeArgs, User, UserStatus } from 'src/types'
import { RequireFields, Resolvers } from 'src/types/resolvers'
import * as errors from 'src/utils/errors'
import { comparePassword, generateOtp, generateSalt, hashPassword } from 'src/utils/utils'

const sendCode = async (args: RequireFields<MutationResendCodeArgs, 'input'>, isForgotPassword: boolean = false) => {
  const { userId, mobile } = getInput(args)
  let selectedUser: User | null = null

  if (mobile) {
    // Lets first check if mobile is present and user is not already verified.
    const user = await model.user.byMobile(mobile)
    if (user) {
      // Since user is not logged in, route level check doesn't happems, we need to check if user is blocked.
      if (user.isBlocked) {
        throw errors.forbidden(`User ${user.id} is blocked`)
      }
      if (isForgotPassword) {
        selectedUser = user
      } else if (!user.isVerified) {
        selectedUser = user
      }
    }
  } else if (userId) {
    // Lets first check if user is not already activated.
    const user = await model.user.get(userId)
    if (user) {
      // Since user is not logged in, route level check doesn't happems, we need to check if user is blocked.
      if (user.isBlocked) {
        throw errors.forbidden(`User ${user.id} is blocked`)
      }
      if (isForgotPassword) {
        selectedUser = user
      } else if (!user.isVerified) {
        selectedUser = user
      }
    }
  }

  if (selectedUser) {
    // Check if user already has a code.
    const codes = await model.code.byUserId(selectedUser.id)
    const validCode = codes.find((c) => {
      if (c.expireAt) {
        return moment(c.expireAt).utc().isBefore(moment().utc())
      }
      return false
    })
    if (validCode) {
      throw errors.invalidInput('mobile', 'User already has a valid code')
    }
    // lets send a verification code to the user over SMS
    const code = generateOtp()
    await db.code.create({
      data: {
        code: code.toString(),
        userId: selectedUser.id,
        // 5 minutes
        expireAt: moment(new Date(Date.now() + 60 * 5)).utc().toDate(),
      },
    })
    const mobile = selectedUser.mobile
    await sms(mobile, `${code} is your verification code for PostFoo`)
  }
  return { }
}

const resolvers: Resolvers = {
  Query: {
    me: (_, _args, ctx) => {
      return ctx.user
    },
  },
  Mutation: {
    verifyCode: async (_, args) => {
      const { userId, mobile, code } = getInput(args)
      let selectedUser: User | null = null
      if (mobile) {
        const user = await model.user.byMobile(mobile)
        if (user) {
          // Since user is not logged in, route level check doesn't happems, we need to check if user is blocked.
          if (user.isBlocked) {
            throw errors.forbidden(`User ${user.id} is blocked`)
          }
          if (!user.isVerified) {
            selectedUser = user
          }
        }
      } else if (userId) {
        const user = await model.user.get(userId)
        if (user) {
          // Since user is not logged in, route level check doesn't happems, we need to check if user is blocked.
          if (user.isBlocked) {
            throw errors.forbidden(`User ${user.id} is blocked`)
          }
          if (!user.isVerified) {
            selectedUser = user
          }
        }
      }

      if (selectedUser) {
        const codes = await model.code.byUserId(selectedUser.id)
        if (codes.length > 0) {
          const validCode = codes.find((c) => {
            if (c.expireAt) {
              return moment(c.expireAt).utc().isBefore(moment().utc()) && c.code === code
            }
            return c.code === code
          })
          if (validCode) {
            await model.user.verifyUser(selectedUser.id)
            await model.code.deleteByUserId(selectedUser.id)
            return {}
          } else {
            throw errors.invalidInput('code', 'OTP Code is invalid or expired')
          }
        }
      }
      return { }
    },
    resendCode: async (_, args) => {
      return await sendCode(args)
    },
    signIn: async (_, args, ctx) => {
      const { mobile, password } = getInput(args)
      const user = await model.user.byMobile(mobile)
      if (user) {
        if (user.isBlocked) {
          throw errors.forbidden(`User ${user.id} is blocked`)
        }
        const isSame = await comparePassword(password, user.salt, user.password)
        if (isSame) {
          ctx.user = user
          return user
        }
      }
      throw errors.invalidInput('mobile', 'You have provided wrong mobile or password')
    },
    signUp: async (_root, args, _ctx) => {
      const { mobile, password, firstName, lastName } = getInput(args)
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
    forgotPassword: async (_, args) => {
      return await sendCode(args, true)
    },
    resetPassword: async (_, args) => {
      const { mobile, code, password } = getInput(args)
      let selectedUser: User | null = null

      const user = await model.user.byMobile(mobile)
      if (user) {
        // Since user is not logged in, route level check doesn't happens, we need to check if user is blocked.
        if (user.isBlocked) {
          throw errors.forbidden(`User ${user.id} is blocked`)
        }
        selectedUser = user
      }

      if (selectedUser) {
        const codes = await model.code.byUserId(selectedUser.id)
        if (codes.length > 0) {
          const validCode = codes.find((c) => {
            if (c.expireAt) {
              return moment(c.expireAt).utc().isBefore(moment().utc()) && c.code === code
            }
            return c.code === code
          })
          if (validCode) {
            await model.user.verifyUser(selectedUser.id)
            await model.code.deleteByUserId(selectedUser.id)
            const salt = await generateSalt()
            const hasedPassword = await hashPassword(password, salt)
            await db.user.update({ where: { id: selectedUser.id }, data: { salt, password: hasedPassword } })
            return {}
          } else {
            throw errors.invalidInput('code', 'OTP Code is expired or invalid')
          }
        }
      }
      return { }
    },
  }
}

export default resolvers

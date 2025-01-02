import moment from 'moment'
import db from 'src/db'
import { getInput } from 'src/graphql/checks'
import { sms } from 'src/integrations/messages'
import * as model from 'src/models'
import { User } from 'src/types'
import { Resolvers } from 'src/types/resolvers'
import * as errors from 'src/utils/errors'
import { comparePassword, generateOtp } from 'src/utils/utils'

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
          const validCode = codes.find(c => {
            if (c.expireAt) {
              return moment(c.expireAt).utc().isBefore(moment().utc()) && c.code === code
            }
            return c.code === code
          })
          if (validCode) {
            await model.user.verifyUser(selectedUser.id)
            await model.code.deleteByUserId(selectedUser.id)
            return selectedUser
          } else {
            throw errors.badInput('Code is expired or invalid')
          }
        }
      }
      throw errors.unknown('Something went wrong')
    },
    resendCode: async (_, args) => {
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
          if (!user.isVerified) {
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
          if (!user.isVerified) {
            selectedUser = user
          }
        }
      }

      if (selectedUser) {
        // Check if user already has a code.
        const codes = await model.code.byUserId(selectedUser.id)
        const validCode = codes.find(c => {
            if (c.expireAt) {
              return moment(c.expireAt).utc().isBefore(moment().utc())
            }
            return false
          })
        if (validCode) {
          throw errors.badInput('User already has a validcode')
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
        return { }
      }
      throw errors.unknown('Something went wrong')
    },
    signIn: async (_, args, ctx) => {
      const { mobile, password } = getInput(args)
      const user = await model.user.byMobile(mobile)
      if (user) {
        if (user.isBlocked) {
          throw errors.forbidden('User is blocked')
        }
        const isSame = await comparePassword(password, user.salt, user.password)
        if (isSame) {
          ctx.user = user
          return user
        }
      }
      throw errors.badInput('Wrong email or password')
    }
  }
}

export default resolvers

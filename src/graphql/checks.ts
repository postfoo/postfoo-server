import * as model from 'src/models'
import { GraphQLContext, User } from 'src/types'
import { Resolver } from 'src/types/resolvers'
import * as errors from 'src/utils/errors'
import * as jwt from 'src/utils/jwt'
import { Audience } from 'src/utils/jwt'

type Input<T> = T | { input: T }

export const getInput = <T extends object>(args: Input<T>): T => {
  return 'input' in args ? args.input : args
}

type GqlMiddleware<Parent = unknown, Args = {}> = Resolver<void, Parent, GraphQLContext, Args>
type RootGqlMiddleware<Args = {}> = GqlMiddleware<unknown, Args>

/** Used anywhere where an mobile is included, to require if not taken */
export const mobileIsAvailable: RootGqlMiddleware<Input<{ mobile?: string }>> = async (_, args) => {
  const { mobile } = getInput(args)
  if (mobile && await model.user.byMobile(mobile)) {
    errors.invalidInput('mobile', 'This mobile is already used')
  }
}

/** Used anywhere where current user should not be blocked */
export const isBlocked: GqlMiddleware = (_, _args, ctx) => {
  if (ctx.user && ctx.user.isBlocked) {
    throw errors.forbidden(`User ${ctx.user.id} is blocked`)
  }
}

export const isNotVerified: GqlMiddleware = (_, _args, ctx) => {
  if (ctx.user && ctx.user.isVerified) {
    throw errors.forbidden(`User ${ctx.user.id} is not verified to perform this action`)
  }
}

export const isNotSignedIn: GqlMiddleware = (_, __, ctx) => {
  if (ctx.user) {
    throw errors.forbidden('This can only be accessed by the unauthenticated users')
  }
}

const parseJwt = async (ctx: GraphQLContext) => {
  if (!ctx.jwt && ctx.token) {
    try {
      ctx.jwt = await jwt.verify(ctx.token)
    } catch (err) {
      throw errors.unauthenticated(err.message)
    }
  }
  return ctx.jwt
}

const assertAuth = async (ctx: GraphQLContext) => {
  const jwt = await parseJwt(ctx)
  if (jwt && !ctx.user) {
    ctx.user = await model.user.fromJwt(jwt) as any
  }
  if (!ctx.user) {
    throw errors.unauthenticated()
  }
  return ctx.user
}

const create = <Parent = unknown, Args = {}>(middleware: GqlMiddleware<Parent, Args>, requiresAuth = true): GqlMiddleware<Parent, Args> => {
  return async (_, _args, ctx) => {
    const jwt = await parseJwt(ctx)
    if (jwt?.aud === Audience.Session || requiresAuth) {
      await assertAuth(ctx)
    }
    if (ctx.user && model.user.isSuperadmin(ctx.user)) {
      return
    }
    return middleware(_, _args, ctx)
  }
}

const createRoot = <Args = {}>(middleware: RootGqlMiddleware<Args>, requiresAuth = true) => {
  return create(middleware, requiresAuth)
}

/** Used anywhere where a userId is included, to require it to match the session user's */
export const isMyUser = createRoot<Input<{ userId?: string }>>((_, args, ctx) => {
  const { userId } = getInput(args)
  if (!userId) {
    return
  }
  if (ctx.user.id !== userId) {
    throw errors.forbidden('This can only be accessed by the users themselves')
  }
})

export const isMe = create<User>((user, _args, ctx) => {
  return isMyUser(user, { userId: user.id }, ctx)
})

export const isNotAvailable = create<User>((_user, _args, _ctx) => {
  throw errors.forbidden('This cannot be directly accessed')
})

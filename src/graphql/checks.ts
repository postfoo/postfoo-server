import * as model from 'src/models'
import { GraphQLContext, User, UserStatus } from 'src/types'
import { Resolver } from 'src/types/resolvers'
import * as errors from 'src/utils/errors'
import * as jwt from 'src/utils/jwt'
import { Audience } from 'src/utils/jwt'

type Input<T> = T | { input: T }

export const getInput = <T extends object>(args: Input<T>): T => {
  return 'input' in args ? args.input : args
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

type GqlMiddleware<Parent = unknown, Args = {}> = Resolver<void, Parent, GraphQLContext, Args>
type GqlMiddlewareWithArgs<Args = {}> = GqlMiddleware<unknown, Args>

export const isBlocked = () => (next: any): GqlMiddleware => (root, args, context, info) => {
  if (context.user && context.user.isBlocked) {
    throw errors.forbidden('This cannot be accessed by blocked users')
  }
  return next(root, args, context, info)
}

export const isNotVerified = () => (next: any): GqlMiddleware => (root, args, context, info) => {
  if (context.user && context.user.isVerified) {
    throw errors.forbidden('This can only be accessed by verified users')
  }
  return next(root, args, context, info)
}

export const isNotSignedIn = () => (next: any): GqlMiddleware => (root, args, context, info) => {
  if (context.user) {
    throw errors.forbidden('This can only be accessed by the unauthenticated users')
  }
  return next(root, args, context, info)
}

export const mobileIsAvailable = () => (next: any): GqlMiddlewareWithArgs<Input<{ mobile?: string }>> => async (root, args, context, info) => {
  const { mobile } = getInput(args)
  if (mobile && await model.user.byMobile(mobile)) {
    throw errors.invalidInput('mobile', 'This mobile is already used')
  }
  return next(root, args, context, info)
}


const createMiddleware = <Parent = unknown, Args = {}>(middleware: GqlMiddleware<Parent, Args>, requiresAuth = true): GqlMiddleware<Parent, Args> => {
  return async (root, args, ctx: any, info) => {
    const jwt = await parseJwt(ctx)
    if (jwt?.aud === Audience.Session || requiresAuth) {
      await assertAuth(ctx)
    }
    if (ctx.user && model.user.isSuperadmin(ctx.user)) {
      return
    }
    return middleware(root, args, ctx, info)
  }
}

const createMiddlewareWithArgs = <Args = {}>(middleware: GqlMiddlewareWithArgs<Args>, requiresAuth = true) => {
  return createMiddleware(middleware, requiresAuth)
}

export const isMe = () => (next: any) => createMiddleware<User>((user, args, context, info) => {
  if (context.user.id !== user.id) {
    throw errors.forbidden('This can only be accessed by the users themselves')
  }
  return next(user, args, context, info)
})

export const isNotAvailable = () => (_next: any) => createMiddleware<User>((_user, _args, _context, _info) => {
  throw errors.forbidden('This cannot be directly accessed')
})

export const isSuperadmin = () => (next: any) => createMiddlewareWithArgs<Input<{}>>((root, args, context, info) => {
  if (context.user.status !== UserStatus.Superadmin) {
    throw errors.forbidden('This can only be accessed by the superadmins')
  }
  return next(root, args, context, info)
})

export const isMemberOfPortfolio = () => (next: any) => createMiddlewareWithArgs<Input<{ portfolioId: string }>>(async (root, args, context, info) => {
  const { portfolioId } = getInput(args)
  const isMember = await model.membership.isMember(context.user.id, portfolioId)
  if (!isMember) {
    throw errors.forbidden(`You are not a member of the portfolio: ${portfolioId}`)
  }
  return next(root, args, context, info)
})

export const isPortfolioAdmin = () => (next: any) => createMiddlewareWithArgs<Input<{ portfolioId: string }>>(async (root, args, context, info) => {
  const { portfolioId } = getInput(args)
  const isAdmin = await model.membership.isAdmin(context.user.id, portfolioId)
  if (!isAdmin) {
    throw errors.forbidden(`You are not a Admin of the portfolio: ${portfolioId}`)
  }
  return next(root, args, context, info)
})

export const isMemberOfPortfolioFund = () => (next: any) => createMiddlewareWithArgs<Input<{ portfolioFundId: string }>>(async (root, args, context, info) => {
  const { portfolioFundId } = getInput(args)
  const portfolioFund = await model.portfolioFund.get(portfolioFundId)
  const portfolioId = portfolioFund.portfolioId
  const isMember = await model.membership.isMember(context.user.id, portfolioId)
  if (!isMember) {
    throw errors.forbidden(`You are not a member of the portfolio: ${portfolioId}`)
  }
  return next(root, args, context, info)
})

export const isPortfolioFundAdmin = () => (next: any) => createMiddlewareWithArgs<Input<{ portfolioFundId: string }>>(async (root, args, context, info) => {
  const { portfolioFundId } = getInput(args)
  const portfolioFund = await model.portfolioFund.get(portfolioFundId)
  const isAdmin = await model.membership.isAdmin(context.user.id, portfolioFund.portfolioId)
  if (!isAdmin) {
    throw errors.forbidden(`You are not a Admin of the portfolio: ${portfolioFund.portfolioId}`)
  }
  return next(root, args, context, info)
})

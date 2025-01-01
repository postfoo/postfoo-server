import { User } from '@prisma/client'
import { Node as GQLNode, PageInfo } from 'src/types/graphql'
import { Resolvers } from 'src/types/resolvers'
import { Jwt } from 'src/utils/jwt'
import { OverrideProperties } from 'type-fest'

export interface GraphQLContext {
  token?: string,
  jwt?: Jwt,
  // Can be undefined but would force every resolver to check it
  user: User,
}

// With this trick, db model types override their GraphQL counterpart
export * from '@prisma/client'
// @ts-expect-error
export * from './graphql'

export type Nil = null | undefined
// Override Maybe in resolvers to include nulls
export type Maybe<T> = T | Nil

// Base type of a function
export type Func = (...args: any[]) => any

export type AllResolvers = Required<Resolvers>
export type Mutations = AllResolvers['Mutation']
export type Queries = AllResolvers['Query']

// This is basically the same as Resolvers but functions return Promise<void>
export type Permissions = {
  [K in keyof AllResolvers]?: {
    [R in keyof AllResolvers[K]]?: Required<AllResolvers[K]>[R] extends Func ?
      Array<(...args: Parameters<Required<AllResolvers[K]>[R]>) => void | Promise<void>> : never
  }
}

// Override the GraphQL one because DB types use Date, so it supports both
export type Node = OverrideProperties<GQLNode, {
  createdAt: Date | string,
  updatedAt: Date | string,
}>

// Override the one with GraphQL so it supports an incoming type
export interface PagePayload<T extends Node> {
  nodes: T[],
  pageInfo: PageInfo,
  total: number,
}

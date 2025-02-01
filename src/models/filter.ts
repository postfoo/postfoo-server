import { Prisma } from '@prisma/client'
import { compact, isEmpty } from 'lodash'
import { FundsInput, StocksInput } from 'src/types'

export const fromSearch = (search?: string): Prisma.StringFilter | undefined => {
  return search?.trim() ? { contains: search.trim(), mode: Prisma.QueryMode.insensitive } : undefined
}

export const fundSearch = (search?: string): Pick<Prisma.FundWhereInput, 'OR'> => {
  const filter = fromSearch(search)
  return { OR: filter && compact([
    { id: filter }, { name: filter }, { symbol1: filter },
  ]) }
}

export const funds = (input?: FundsInput): Prisma.FundWhereInput | undefined => {
  if (isEmpty(input)) {
    return
  }
  return {
    ...fundSearch(input.search),
    category: input.category,
    type: input.type,
    plan: input.plan,
  }
}

export const stockSearch = (search?: string): Pick<Prisma.StockWhereInput, 'OR'> => {
  const filter = fromSearch(search)
  return { OR: filter && compact([
    { id: filter }, { name: filter }, { symbol: filter },
  ]) }
}


export const stocks = (input?: StocksInput): Prisma.StockWhereInput | undefined => {
  if (isEmpty(input)) {
    return
  }
  return {
    ...stockSearch(input.search),
    exchange: input.exchange,
  }
}

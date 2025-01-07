import { isNumber, last } from 'lodash'
import { Node, PageInput, PagePayload, Prisma } from 'src/types'

// The type is not exported, so we need to define it here. It is same for all
type Page = Pick<Prisma.FundFindManyArgs, 'take' | 'skip'> & { cursor?: { id: string } }

/** Converts a GQL page input to a DB one */
export const mapPageInput = (input: PageInput = {}, defaultCount?: number): Page => {
  return {
    // 0 is a valid first, so they can fetch the total without data
    take: isNumber(input.first) ? input.first
      : (input.last && -input.last || defaultCount),
    // Prisma includes the cursor in the list unless skipped
    skip: (input.offset || 0) + (input.after ? 1 : 0),
    cursor: input.after ? { id: input.after } : undefined,
  }
}

/** Generates a paginated response */
export const paginateList = <T extends Node>(nodes: T[], input: PageInput = {}, total = -1): PagePayload<any> => {
  const count = Math.abs(input.first || input.last || Infinity)
  const fullPage = nodes.length > 0 && nodes.length === count
  const hasOffset = !!(input.after || input.offset)
  return { nodes, total, pageInfo: {
    startCursor: nodes[0]?.id,
    endCursor: last(nodes)?.id,
    hasPreviousPage: input.last ? fullPage : hasOffset,
    hasNextPage: !input.last ? fullPage : hasOffset,
  } }
}

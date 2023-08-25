import { Prisma, PrismaPromise } from "@prisma/client"
import { GraphQLError } from "graphql"
import prisma from "../config/prisma"
import { PostsFilters } from "../__generated__/resolvers-types"

type Cursor = {
  id: string
  voteSum?: number
}

interface PaginateArgs {
  first: number
  after?: Cursor
}

interface PrismaPaginateArgs {
  cursor?: {
    id: string
  }
  take: number
  skip?: number
}

interface Edge<T> {
  node: T
  cursor: Cursor
}

interface PageInfo {
  endCursor?: Cursor
  hasNextPage: boolean
}

export interface PaginateReturn<T> {
  edges: Array<Edge<T>>
  pageInfo: PageInfo
}

export const paginatePostsByVoteSum = async <
  Node extends { id: string; voteSum: number }
>(
  paginateArgs: PaginateArgs,
  asc: boolean,
  filters?: PostsFilters
): Promise<PaginateReturn<Node>> => {
  checkPaginationArgs(paginateArgs)

  if (paginateArgs.after && paginateArgs.after.voteSum == null) {
    throw new GraphQLError("Vote sum must be specified with cursor", {
      extensions: { code: "PAGINATION_ERROR" },
    })
  }

  const communityId = filters?.communityId
  const userId = filters?.userId

  const postsQuery = Prisma.sql`
    SELECT "A".*, CAST(COALESCE("B"."votes", 0) AS int) as "voteSum" FROM "Post" "A" 
    LEFT JOIN (SELECT "postId", sum("like") as "votes" 
    FROM "PostVote" GROUP BY "postId") "B" ON "A"."id" = "B"."postId"`

  const cursor = asc
    ? Prisma.sql`(${paginateArgs.after}::json IS NULL OR CAST(COALESCE("B"."votes", 0) AS int) <= ${paginateArgs.after?.voteSum} AND ("A"."id" > ${paginateArgs.after?.id} OR CAST(COALESCE("B"."votes", 0) AS int) < ${paginateArgs.after?.voteSum}))`
    : Prisma.sql`(${paginateArgs.after}::json IS NULL OR CAST(COALESCE("B"."votes", 0) AS int) >= ${paginateArgs.after?.voteSum} AND ("A"."id" > ${paginateArgs.after?.id} OR CAST(COALESCE("B"."votes", 0) AS int) > ${paginateArgs.after?.voteSum}))`

  const where = Prisma.sql`WHERE 1=1 
    AND (${communityId}::text IS NULL OR "A"."communityId" = ${communityId}) 
    AND (${userId}::text IS NULL OR "A"."userId" = ${userId}) 
    AND ${cursor}`

  const orderBy = asc
    ? Prisma.sql`ORDER BY "voteSum" DESC, "A"."id" ASC`
    : Prisma.sql`ORDER BY "voteSum" ASC, "A"."id" ASC`

  const limit = Prisma.sql`LIMIT ${paginateArgs.first + 1}::int`

  const nodes: Node[] =
    await prisma.$queryRaw`${postsQuery} ${where} ${orderBy} ${limit}`

  const edges: Edge<Node>[] = nodes.map((node) => {
    return { node, cursor: { id: node.id, voteSum: node.voteSum } }
  })

  const hasNextPage = nodes.length > paginateArgs.first

  if (hasNextPage) {
    edges.pop()
    nodes.pop()
  }

  const endCursor =
    edges.length && hasNextPage ? edges[edges.length - 1].cursor : undefined

  const pageInfo: PageInfo = {
    endCursor,
    hasNextPage,
  }

  return {
    edges,
    pageInfo,
  }
}

export const paginate = async <Node extends { id: string }>(
  paginateArgs: PaginateArgs,
  prismaFunc: (options: PrismaPaginateArgs) => PrismaPromise<Array<Node> | null>
): Promise<PaginateReturn<Node>> => {
  checkPaginationArgs(paginateArgs)

  const cursor = paginateArgs.after ? { id: paginateArgs.after.id } : undefined
  const take = paginateArgs.first + 1
  const skip = cursor ? 1 : undefined

  const nodes: Node[] = (await prismaFunc({ cursor, take, skip })) ?? []

  const edges: Edge<Node>[] = nodes.map((node) => {
    return { node, cursor: { id: node.id } }
  })

  const hasNextPage = nodes.length > paginateArgs.first

  if (hasNextPage) {
    edges.pop()
    nodes.pop()
  }

  const endCursor =
    nodes.length && hasNextPage ? edges[edges.length - 1].cursor : undefined

  const pageInfo: PageInfo = {
    endCursor,
    hasNextPage,
  }

  return {
    edges,
    pageInfo,
  }
}

export const checkPaginationArgs = (paginateArgs: PaginateArgs): void => {
  if (paginateArgs.first <= 0 || paginateArgs.first > 100) {
    throw new GraphQLError("First must be between 0 and 100", {
      extensions: { code: "PAGINATION_ERROR" },
    })
  }
}

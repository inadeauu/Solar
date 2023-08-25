import { Prisma, PrismaPromise } from "@prisma/client"
import { GraphQLError } from "graphql"
import prisma from "../config/prisma"

type Cursor = {
  id: string
  voteSum?: number
}

interface PaginateArgs {
  first?: number
  after?: Cursor
  last?: number
  before?: Cursor
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
  startCursor?: Cursor
  hasPreviousPage: boolean
}

export interface PaginateReturn<T> {
  edges: Array<Edge<T>>
  pageInfo: PageInfo
}

export const paginateVoteSum = async <
  Node extends { id: string; voteSum: number }
>(
  paginateArgs: PaginateArgs,
  top: boolean
): Promise<PaginateReturn<Node>> => {
  checkPaginationArgs(paginateArgs)

  if (paginateArgs.after && paginateArgs.after.voteSum == null) {
    throw new GraphQLError("Vote sum must be specified with cursor", {
      extensions: { code: "PAGINATION_ERROR" },
    })
  }

  let nodes: Array<Node>
  let edges: Array<Edge<Node>>
  let hasPreviousPage: boolean
  let hasNextPage: boolean

  const postsQuery = Prisma.sql`SELECT "A".*, CAST(COALESCE("B"."votes", 0) AS int) as "voteSum" FROM "Post" "A" LEFT JOIN (SELECT "postId", sum("like") as "votes" FROM "PostVote" GROUP BY "postId") "B" ON "A"."id" = "B"."postId"`
  const orderBy = top
    ? Prisma.sql`ORDER BY "voteSum" DESC, "A"."id" ASC`
    : Prisma.sql`ORDER BY "voteSum" ASC, "A"."id" ASC`

  if (paginateArgs.first) {
    const cursor = paginateArgs.after
      ? Prisma.sql`WHERE CAST(COALESCE("B"."votes", 0) AS int) <= ${paginateArgs.after.voteSum} AND ("A"."id" >= ${paginateArgs.after.id} OR CAST(COALESCE("B"."votes", 0) AS int) < ${paginateArgs.after.voteSum})`
      : Prisma.sql``
    const take = Prisma.sql`LIMIT ${paginateArgs.first + 1}`

    nodes = await prisma.$queryRaw`${postsQuery} ${cursor} ${orderBy} ${take}`

    edges = nodes.map((node) => {
      return { node, cursor: { id: node.id, voteSum: node.voteSum } }
    })

    hasPreviousPage = !!paginateArgs.after
    hasNextPage = nodes.length > paginateArgs.first

    if (hasNextPage) {
      edges.pop()
      nodes.pop()
    }
  } else {
    const cursor =
      paginateArgs.before &&
      Prisma.sql`WHERE ("voteSum", "id") <= (${paginateArgs.before.voteSum}, ${paginateArgs.before.id})`
    const take = Prisma.sql`LIMIT ${paginateArgs.last! + 1}`

    nodes = await prisma.$queryRaw`${postsQuery} ${cursor} ${orderBy} ${take}`

    edges = nodes.map((node) => {
      return { node, cursor: { id: node.id, voteSum: node.voteSum } }
    })

    hasPreviousPage = nodes.length > paginateArgs.last!
    hasNextPage = !!paginateArgs.before

    if (hasPreviousPage) {
      edges.shift()
      nodes.shift()
    }
  }

  const startCursor =
    nodes.length && hasPreviousPage ? edges[0].cursor : undefined
  const endCursor =
    nodes.length && hasNextPage ? edges[edges.length - 1].cursor : undefined

  const pageInfo: PageInfo = {
    endCursor,
    hasNextPage,
    startCursor,
    hasPreviousPage,
  }

  console.log(paginateArgs)
  console.log(pageInfo)

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

  let nodes: Array<Node>
  let edges: Array<Edge<Node>>
  let hasPreviousPage: boolean
  let hasNextPage: boolean

  if (paginateArgs.first) {
    const cursor = paginateArgs.after
      ? { id: paginateArgs.after.id }
      : undefined
    const take = paginateArgs.first + 1
    const skip = cursor ? 1 : undefined

    nodes = (await prismaFunc({ cursor, take, skip })) ?? []

    edges = nodes.map((node) => {
      return { node, cursor: { id: node.id } }
    })

    hasPreviousPage = !!paginateArgs.after
    hasNextPage = nodes.length > paginateArgs.first

    if (hasNextPage) {
      edges.pop()
      nodes.pop()
    }
  } else {
    const cursor = paginateArgs.before
      ? { id: paginateArgs.before.id }
      : undefined
    const take = -(paginateArgs.last! + 1)
    const skip = cursor ? 1 : undefined

    nodes = (await prismaFunc({ cursor, take, skip })) ?? []

    edges = nodes.map((node) => {
      return { node, cursor: { id: node.id } }
    })

    hasPreviousPage = nodes.length > paginateArgs.last!
    hasNextPage = !!paginateArgs.before

    if (hasPreviousPage) {
      edges.shift()
      nodes.shift()
    }
  }

  const startCursor =
    nodes.length && hasPreviousPage ? edges[0].cursor : undefined
  const endCursor =
    nodes.length && hasNextPage ? edges[edges.length - 1].cursor : undefined

  const pageInfo: PageInfo = {
    endCursor,
    hasNextPage,
    startCursor,
    hasPreviousPage,
  }

  return {
    edges,
    pageInfo,
  }
}

export const checkPaginationArgs = (paginateArgs: PaginateArgs): void => {
  if (paginateArgs.first == null && paginateArgs.last == null) {
    throw new GraphQLError("Either first or last must be specified", {
      extensions: { code: "PAGINATION_ERROR" },
    })
  } else if (
    (paginateArgs.first && paginateArgs.last) ||
    (paginateArgs.first && paginateArgs.before) ||
    (paginateArgs.after && paginateArgs.last) ||
    (paginateArgs.after && paginateArgs.before)
  ) {
    throw new GraphQLError("Only first/after or last/before may be specified", {
      extensions: { code: "PAGINATION_ERROR" },
    })
  } else if (paginateArgs.first && paginateArgs.first <= 0) {
    throw new GraphQLError("First must be greater than 0", {
      extensions: { code: "PAGINATION_ERROR" },
    })
  } else if (paginateArgs.last && paginateArgs.last <= 0) {
    throw new GraphQLError("Last must be greater than 0", {
      extensions: { code: "PAGINATION_ERROR" },
    })
  } else if (paginateArgs.first && paginateArgs.first > 100) {
    throw new GraphQLError("First must be 100 or less", {
      extensions: { code: "PAGINATION_ERROR" },
    })
  } else if (paginateArgs.last && paginateArgs.last > 100) {
    throw new GraphQLError("Last must be 100 or less", {
      extensions: { code: "PAGINATION_ERROR" },
    })
  }
}

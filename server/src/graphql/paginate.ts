import { PrismaPromise } from "@prisma/client"
import { GraphQLError } from "graphql"

interface PaginateArgs {
  first?: number
  after?: string
  last?: number
  before?: string
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
  cursor: string
}

interface PageInfo {
  endCursor?: string
  hasNextPage: boolean
  startCursor?: string
  hasPreviousPage: boolean
}

interface PaginateReturn<T> {
  edges: Array<Edge<T>>
  pageInfo: PageInfo
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
    const cursor = paginateArgs.after ? { id: paginateArgs.after } : undefined
    const take = paginateArgs.first + 1
    const skip = cursor ? 1 : undefined

    nodes = (await prismaFunc({ cursor, take, skip })) ?? []

    edges = nodes.map((node) => {
      return { node, cursor: node.id }
    })

    hasPreviousPage = !!paginateArgs.after
    hasNextPage = nodes.length > paginateArgs.first

    if (hasNextPage) edges.pop()
  } else {
    const cursor = paginateArgs.before ? { id: paginateArgs.before } : undefined
    const take = -(paginateArgs.last! + 1)
    const skip = cursor ? 1 : undefined

    nodes = (await prismaFunc({ cursor, take, skip })) ?? []

    edges = nodes.map((node) => {
      return { node, cursor: node.id }
    })

    hasPreviousPage = nodes.length > paginateArgs.last!
    hasNextPage = !!paginateArgs.before

    if (hasPreviousPage) edges.shift()
  }

  const startCursor = nodes.length ? nodes[0].id : undefined
  const endCursor = nodes.length ? nodes[nodes.length - 1].id : undefined

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
  }
}

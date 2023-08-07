import { PrismaPromise } from "@prisma/client"
import { GraphQLError } from "graphql"

interface PaginateArgs {
  first?: number | null
  after?: string | null
  last?: number | null
  before?: string | null
}

export interface PrismaPaginateArgs {
  cursor?: {
    id: string
  }
  take?: number
  skip?: number
}

interface Edge<T> {
  node: T
  cursor: string
}

interface PageInfo {
  endCursor?: string | null
  hasNextPage: boolean
  startCursor?: string | null
  hasPreviousPage: boolean
}

export interface PaginateReturn<T> {
  edges?: Array<Edge<T>>
  pageInfo: PageInfo
}

export const paginate = async <Node extends { id: string }>(
  paginateArgs: PaginateArgs,
  prismaFunc: (options: PrismaPaginateArgs) => PrismaPromise<Node[] | null>
): Promise<PaginateReturn<Node>> => {
  checkPaginationArgs(paginateArgs)

  let nodes: Array<Node> | null
  let edges: Array<Edge<Node>> | null
  let hasPreviousPage: boolean
  let hasNextPage: boolean

  if (paginateArgs.first) {
    const cursor = paginateArgs.after ? { id: paginateArgs.after } : undefined
    const take = paginateArgs.first + 1
    const skip = cursor ? 1 : undefined

    nodes = await prismaFunc({ cursor, take, skip })

    edges =
      nodes?.map((node) => {
        return { node, cursor: node.id }
      }) ?? []

    hasPreviousPage = !!paginateArgs.after
    hasNextPage = nodes ? nodes.length > paginateArgs.first : false

    if (hasNextPage) edges?.pop()
  } else {
    const cursor = paginateArgs.before ? { id: paginateArgs.before } : undefined
    const take = -(paginateArgs.last! + 1)
    const skip = cursor ? 1 : undefined

    nodes = await prismaFunc({ cursor, take, skip })

    edges =
      nodes?.map((node) => {
        return { node, cursor: node.id }
      }) ?? []

    hasPreviousPage = nodes ? nodes.length > paginateArgs.last! : false
    hasNextPage = !!paginateArgs.before

    if (hasPreviousPage) edges?.shift()
  }

  const startCursor = nodes ? (nodes.length > 0 ? nodes[0].id : null) : null
  const endCursor = nodes
    ? nodes.length > 0
      ? nodes[nodes.length - 1].id
      : null
    : null

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
  if (
    (paginateArgs.first && paginateArgs.last) ||
    (paginateArgs.first && paginateArgs.before) ||
    (paginateArgs.after && paginateArgs.last) ||
    (paginateArgs.after && paginateArgs.before) ||
    (paginateArgs.first == null && paginateArgs.last == null)
  ) {
    throw new GraphQLError("Invalid pagination input arguments", {
      extensions: { code: "PAGINATION_ERROR" },
    })
  }
}

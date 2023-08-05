import { PrismaPromise } from "@prisma/client"
import { GraphQLError } from "graphql"
import { boolean } from "zod"

// export interface PrismaPaginateArgs {
//   cursor?: {
//     id: string
//   }
//   take?: number
//   skip?: number
// }

// export interface PaginateReturn<T> {
//   edges?: Edge<T>[]
//   pageInfo: PageInfo
// }

// export const paginate = async <Node extends { id: string }>(
//   paginateArgs: PaginateArgs,
//   prismaFunc: (
//     options: PrismaPaginateArgs
//   ) => PrismaPromise<Partial<Node>[] | null>
// ): Promise<PaginateReturn<Partial<Node>>> => {
//   let nodes: Array<Partial<Node>> | null
//   let edges: Array<Edge<Partial<Node>>> | null
//   let hasPreviousPage: boolean
//   let hasNextPage: boolean

//   if (paginateArgs.first) {
//     const cursor = paginateArgs.after ? { id: paginateArgs.after } : undefined
//     const take = paginateArgs.first + 1
//     const skip = cursor ? 1 : undefined

//     nodes = await prismaFunc({ cursor, take, skip })

//     edges =
//       nodes?.map((node) => {
//         return { node, cursor: node.id! }
//       }) ?? null

//     hasPreviousPage = !!paginateArgs.after
//     hasNextPage = nodes ? nodes.length > paginateArgs.first : false

//     if (hasNextPage) nodes?.pop()
//   } else {
//     const cursor = paginateArgs.before ? { id: paginateArgs.before } : undefined
//     const take = -(paginateArgs.last! + 1)
//     const skip = cursor ? 1 : undefined

//     nodes = await prismaFunc({ cursor, take, skip })

//     edges =
//       nodes?.map((node) => {
//         return { node, cursor: node.id! }
//       }) ?? null

//     hasPreviousPage = nodes ? nodes.length > paginateArgs.last! : false
//     hasNextPage = !!paginateArgs.before
//   }

//   const startCursor = nodes ? (nodes.length > 0 ? nodes[0].id : null) : null
//   const endCursor = nodes
//     ? nodes.length > 0
//       ? nodes[nodes.length - 1].id
//       : null
//     : null

//   const pageInfo: PageInfo = {
//     endCursor,
//     hasNextPage,
//     startCursor,
//     hasPreviousPage,
//   }

//   return {
//     edges: edges ?? undefined,
//     pageInfo,
//   }
// }

interface PaginateArgs {
  first?: number | null
  after?: string | null
  last?: number | null
  before?: string | null
}

interface PaginationOptions {
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

export const generatePaginationOptions = (
  paginateArgs: PaginateArgs
): PaginationOptions => {
  let cursor: { id: string } | undefined
  let skip: number | undefined
  let take: number

  if (paginateArgs.first) {
    cursor = paginateArgs.after ? { id: paginateArgs.after } : undefined
    take = paginateArgs.first + 1
    skip = cursor ? 1 : undefined
  } else {
    cursor = paginateArgs.before ? { id: paginateArgs.before } : undefined
    take = -(paginateArgs.last! + 1)
    skip = cursor ? 1 : undefined
  }

  return {
    cursor,
    skip,
    take,
  }
}

export const generateEdges = <Node extends { id: string }>(
  nodes: Node[] | null
): Array<Edge<Node>> | undefined => {
  const edges = nodes?.map((node) => {
    return { node, cursor: node.id }
  })

  return edges
}

export const generatePageInfo = <Node extends { id: string }>(
  nodes: Node[] | null,
  paginateArgs: PaginateArgs
): PageInfo => {
  let hasPreviousPage: boolean
  let hasNextPage: boolean

  if (paginateArgs.first) {
    hasPreviousPage = !!paginateArgs.after
    hasNextPage = nodes ? nodes.length > paginateArgs.first : false
  } else {
    hasPreviousPage = nodes ? nodes.length > paginateArgs.last! : false
    hasNextPage = !!paginateArgs.before
  }

  const startCursor = nodes ? (nodes.length > 0 ? nodes[0].id : null) : null
  const endCursor = nodes
    ? nodes.length > 0
      ? nodes[nodes.length - 1].id
      : null
    : null

  return {
    hasPreviousPage,
    hasNextPage,
    startCursor,
    endCursor,
  }
}

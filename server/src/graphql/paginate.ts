import { Comment, Community, Post, Prisma, PrismaPromise } from "@prisma/client"
import { GraphQLError } from "graphql"
import prisma from "../config/prisma"
import {
  CommentsFilters,
  CommunitiesFilters,
  PostsFilters,
} from "../__generated__/resolvers-types"

type Cursor = {
  id: string
  title?: string
  voteSum?: number
  created_at?: Date
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

type PostPaginate = Post & { voteSum: number }

export const paginatePosts = async (
  paginateArgs: PaginateArgs,
  filters: PostsFilters
): Promise<PaginateReturn<Post>> => {
  checkPaginationArgs(paginateArgs)

  const communityId = filters.communityId
  const userId = filters.userId
  const orderByType = filters.orderBy

  let postsQuery: Prisma.Sql
  let cursor: Prisma.Sql
  let orderBy: Prisma.Sql

  if (orderByType == "NEW" || orderByType == "OLD") {
    if (paginateArgs.after && paginateArgs.after.created_at == null) {
      throw new GraphQLError("Created at must be specified with cursor", {
        extensions: { code: "PAGINATION_ERROR" },
      })
    }

    postsQuery = Prisma.sql`SELECT "p".* FROM (SELECT "id", "userId", "communityId", "title", "body", to_char("created_at"::timestamp, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "created_at", "updated_at" from "Post") as "p"`
    const id = paginateArgs.after?.id
    const created_at = paginateArgs.after?.created_at?.toISOString()

    cursor =
      orderByType == "NEW"
        ? Prisma.sql`(${paginateArgs.after}::json IS NULL OR "p"."created_at" <= ${created_at} AND ("p"."id" > ${id} OR "p"."created_at" < ${created_at}))`
        : Prisma.sql`(${paginateArgs.after}::json IS NULL OR "p"."created_at" >= ${created_at} AND ("p"."id" > ${id} OR "p"."created_at" > ${created_at}))`

    orderBy =
      orderByType == "NEW"
        ? Prisma.sql`ORDER BY "p"."created_at" DESC, "p"."id" ASC`
        : Prisma.sql`ORDER BY "p"."created_at" ASC, "p"."id" ASC`
  } else {
    if (paginateArgs.after && paginateArgs.after.voteSum == null) {
      throw new GraphQLError("Vote sum must be specified with cursor", {
        extensions: { code: "PAGINATION_ERROR" },
      })
    }

    postsQuery = Prisma.sql`
      SELECT "p".* FROM (SELECT "id", "userId", "communityId", "title", "body", "created_at", "updated_at", CAST(COALESCE("B"."votes", 0) AS int) as "voteSum" FROM "Post"
      LEFT JOIN (SELECT "postId", sum("like") as "votes" 
      FROM "PostVote" GROUP BY "postId") "B" ON "Post"."id" = "B"."postId") as "p"`

    const id = paginateArgs.after?.id
    const voteSum = paginateArgs.after?.voteSum

    cursor =
      orderByType == "TOP"
        ? Prisma.sql`(${paginateArgs.after}::json IS NULL OR "p"."voteSum" <= ${voteSum} AND ("p"."id" > ${id} OR "p"."voteSum" < ${voteSum}))`
        : Prisma.sql`(${paginateArgs.after}::json IS NULL OR "p"."voteSum" >= ${voteSum} AND ("p"."id" > ${id} OR "p"."voteSum" > ${voteSum}))`

    orderBy =
      orderByType == "TOP"
        ? Prisma.sql`ORDER BY "p"."voteSum" DESC, "p"."id" ASC`
        : Prisma.sql`ORDER BY "p"."voteSum" ASC, "p"."id" ASC`
  }

  const where = Prisma.sql`WHERE 1=1 
    AND (${communityId}::text IS NULL OR "p"."communityId" = ${communityId}) 
    AND (${userId}::text IS NULL OR "p"."userId" = ${userId}) 
    AND ${cursor}`

  const limit = Prisma.sql`LIMIT ${paginateArgs.first + 1}`

  const nodes: PostPaginate[] =
    await prisma.$queryRaw`${postsQuery} ${where} ${orderBy} ${limit}`

  const edges: Edge<Post>[] = nodes.map((node) => {
    return {
      node,
      cursor: {
        id: node.id,
        voteSum: node.voteSum,
        created_at: node.created_at,
      },
    }
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

type CommentPaginate = Comment & { voteSum: number }

export const paginateComments = async (
  paginateArgs: PaginateArgs,
  filters: CommentsFilters
): Promise<PaginateReturn<Comment>> => {
  checkPaginationArgs(paginateArgs)

  const userId = filters.userId
  const postId = filters.postId
  const parentId = filters.parentId
  const allReplies = filters.replies
  const orderByType = filters.orderBy

  let commentsQuery: Prisma.Sql
  let cursor: Prisma.Sql
  let orderBy: Prisma.Sql

  if (orderByType == "NEW" || orderByType == "OLD") {
    if (paginateArgs.after && paginateArgs.after.created_at == null) {
      throw new GraphQLError("Created at must be specified with cursor", {
        extensions: { code: "PAGINATION_ERROR" },
      })
    }

    commentsQuery = Prisma.sql`SELECT "c".* FROM (SELECT "id", "postId", "userId", "parentId", "body", to_char("created_at"::timestamp, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "created_at", "updated_at" from "Comment") as "c"`
    const id = paginateArgs.after?.id
    const created_at = paginateArgs.after?.created_at?.toISOString()

    cursor =
      orderByType == "NEW"
        ? Prisma.sql`(${paginateArgs.after}::json IS NULL OR "c"."created_at" <= ${created_at} AND ("c"."id" > ${id} OR "c"."created_at" < ${created_at}))`
        : Prisma.sql`(${paginateArgs.after}::json IS NULL OR "c"."created_at" >= ${created_at} AND ("c"."id" > ${id} OR "c"."created_at" > ${created_at}))`

    orderBy =
      orderByType == "NEW"
        ? Prisma.sql`ORDER BY "c"."created_at" DESC, "c"."id" ASC`
        : Prisma.sql`ORDER BY "c"."created_at" ASC, "c"."id" ASC`
  } else {
    if (paginateArgs.after && paginateArgs.after.voteSum == null) {
      throw new GraphQLError("Vote sum must be specified with cursor", {
        extensions: { code: "PAGINATION_ERROR" },
      })
    }

    commentsQuery = Prisma.sql`
      SELECT "c".* FROM (SELECT "id", "postId", "userId", "parentId", "body", "created_at", "updated_at", CAST(COALESCE("B"."votes", 0) AS int) as "voteSum" FROM "Comment"
      LEFT JOIN (SELECT "commentId", sum("like") as "votes" 
      FROM "CommentVote" GROUP BY "commentId") "B" ON "Comment"."id" = "B"."commentId") as "c"`

    const id = paginateArgs.after?.id
    const voteSum = paginateArgs.after?.voteSum

    cursor =
      orderByType == "TOP"
        ? Prisma.sql`(${paginateArgs.after}::json IS NULL OR "c"."voteSum" <= ${voteSum} AND ("c"."id" > ${id} OR "c"."voteSum" < ${voteSum}))`
        : Prisma.sql`(${paginateArgs.after}::json IS NULL OR "c"."voteSum" >= ${voteSum} AND ("c"."id" > ${id} OR "c"."voteSum" > ${voteSum}))`

    orderBy =
      orderByType == "TOP"
        ? Prisma.sql`ORDER BY "c"."voteSum" DESC, "c"."id" ASC`
        : Prisma.sql`ORDER BY "c"."voteSum" ASC, "c"."id" ASC`
  }

  const where = Prisma.sql`WHERE 1=1 
    AND (${userId}::text IS NULL OR "c"."userId" = ${userId}) 
    AND (${postId}::text IS NULL OR "c"."postId" = ${postId}) 
    AND (CASE 
        WHEN ${allReplies}::boolean = true THEN "c"."parentId" IS NOT NULL
        ELSE (${parentId}::text IS NOT NULL OR "c"."parentId" IS NULL) AND (${parentId}::text IS NULL OR "c"."parentId" = ${parentId})
        END
    )
    AND ${cursor}`

  const limit = Prisma.sql`LIMIT ${paginateArgs.first + 1}`

  const nodes: CommentPaginate[] =
    await prisma.$queryRaw`${commentsQuery} ${where} ${orderBy} ${limit}`

  const edges: Edge<Comment>[] = nodes.map((node) => {
    return {
      node,
      cursor: {
        id: node.id,
        voteSum: node.voteSum,
        created_at: node.created_at,
      },
    }
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

export const paginateCommunities = async (
  userId: string | undefined,
  paginateArgs: PaginateArgs,
  filters: CommunitiesFilters
): Promise<PaginateReturn<Community>> => {
  checkPaginationArgs(paginateArgs)

  const titleContains = filters.titleContains
  const ownerId = filters.ownerId
  const memberId = filters.memberId

  if (paginateArgs.after && paginateArgs.after.title == null) {
    throw new GraphQLError("Created at must be specified with title", {
      extensions: { code: "PAGINATION_ERROR" },
    })
  }

  const communitiesQuery = Prisma.sql`SELECT "c".*, "B".member FROM "Community" as "c" LEFT JOIN (SELECT "A" as "member", "B" as "communityId" from "_UserInCommunities" GROUP BY "member", "communityId") "B" on "B"."communityId" = "c"."id"`

  const id = paginateArgs.after?.id
  const title = paginateArgs.after?.title
  const cursor = Prisma.sql`(${paginateArgs.after}::json IS NULL OR "c"."title" <= ${title} AND ("c"."id" > ${id} OR "c"."title" < ${title}))`

  const where = Prisma.sql`WHERE 1=1 
    AND (${titleContains}::text IS NULL OR "c"."title" LIKE ${titleContains}::text || '%') 
    AND (${ownerId}::text IS NULL OR "c"."userId" = ${ownerId})
    AND (${memberId}::text IS NULL OR "B"."member" = ${memberId})
    AND ${cursor}`

  const orderBy = Prisma.sql`ORDER BY "c"."title" ASC`

  const limit = Prisma.sql`LIMIT ${paginateArgs.first + 1}`

  const nodes: Community[] =
    await prisma.$queryRaw`${communitiesQuery} ${where} ${orderBy} ${limit}`

  const edges: Edge<Community>[] = nodes.map((node) => {
    return {
      node,
      cursor: {
        id: node.id,
        title: node.title,
        created_at: node.created_at,
      },
    }
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

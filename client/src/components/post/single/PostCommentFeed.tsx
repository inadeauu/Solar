import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { graphql } from "../../../graphql_codegen"
import { graphQLClient } from "../../../utils/graphql"
import { useEffect } from "react"
import { ImSpinner11 } from "react-icons/im"
import type { Post } from "../../../graphql/types"
import Comment from "../../comment/Comment"

type PostCommentFeedProps = {
  post: Post
}

const getPostCommentFeedDocument = graphql(/* GraphQL */ `
  query PostCommentFeed($input: CommentsInput!) {
    comments(input: $input) {
      edges {
        node {
          body
          created_at
          id
          owner {
            id
            username
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`)

const PostCommentFeed = ({ post }: PostCommentFeedProps) => {
  const { ref, inView } = useInView()

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["postCommentFeed", post.id],
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getPostCommentFeedDocument, {
        input: {
          filters: { postId: post.id, parentId: null },
          paginate: { first: 10, after: pageParam },
        },
      })
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.comments.pageInfo.endCursor
      },
    }
  )

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  }

  return (
    <>
      {isSuccess &&
        data.pages.map((page) =>
          page.comments.edges.map((edge, i) => {
            return (
              <Comment
                innerRef={
                  page.comments.edges.length === i + 1 ? ref : undefined
                }
                key={edge.node.id}
                comment={edge.node}
                queryKey={["postCommentFeed", post.id]}
              />
            )
          })
        )}
      {isFetchingNextPage && (
        <ImSpinner11 className="mt-2 animate-spin h-10 w-10" />
      )}
    </>
  )
}

export default PostCommentFeed

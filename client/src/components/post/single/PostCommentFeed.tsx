import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { graphQLClient } from "../../../utils/graphql"
import { useContext, useEffect } from "react"
import { ImSpinner11 } from "react-icons/im"
import type { Post } from "../../../graphql/types"
import Comment from "../../comment/Comment"
import { getCommentFeedDocument } from "../../../graphql/sharedDocuments"
import { CommentContext } from "../../../contexts/CommentContext"

type PostCommentFeedProps = {
  post: Post
}

const PostCommentFeed = ({ post }: PostCommentFeedProps) => {
  const { ref, inView } = useInView()

  const { commentOrderByType } = useContext(CommentContext)

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["postCommentFeed", post.id, commentOrderByType],
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getCommentFeedDocument, {
        input: {
          filters: {
            postId: post.id,
            parentId: null,
            orderBy: commentOrderByType,
          },
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

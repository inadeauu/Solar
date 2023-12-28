import type { Comment } from "../../graphql/types"
import { getCommentRepliesFeedDocument } from "../../graphql/sharedDocuments"
import { useInfiniteQuery } from "@tanstack/react-query"
import { graphQLClient } from "../../utils/graphql"
import { ImSpinner11 } from "react-icons/im"
import { CommentReply } from "./CommentReply"
import { CommentContext } from "../../contexts/CommentContext"
import { useContext } from "react"

type CommentRepliesProps = {
  comment: Comment
  testid: string
}

const CommentReplies = ({ comment, testid }: CommentRepliesProps) => {
  const { commentOrderByType } = useContext(CommentContext)

  const { data, isLoading, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["commentRepliesFeed", comment.id, commentOrderByType],
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getCommentRepliesFeedDocument, {
        input: {
          filters: { parentId: comment.id, orderBy: commentOrderByType },
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

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  }

  return (
    <div data-testid={`${testid}-replies-feed`} className="flex flex-col gap-4 mt-2 px-[11px]">
      {isSuccess &&
        data.pages.map((page) =>
          page.comments.edges.map((edge, i) => {
            return (
              <CommentReply
                testid={`${testid}-reply-${i}`}
                key={edge.node.id}
                comment={edge.node}
                parentId={comment.id}
              />
            )
          })
        )}
      {hasNextPage ? (
        <button
          data-testid={`${testid}-fetch-button`}
          className="btn_blue w-fit flex text-xs py-1 px-3"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? <ImSpinner11 className="animate-spin h-[14px] w-[14px]" /> : "Show more replies"}
        </button>
      ) : (
        <span>All replies loaded</span>
      )}
    </div>
  )
}

export default CommentReplies

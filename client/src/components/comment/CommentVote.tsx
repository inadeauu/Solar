import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import useCommentVoteMutation from "../../graphql/useCommentVoteMutation"
import { VoteStatus } from "../../graphql_codegen/graphql"
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from "react-icons/bi"
import type { Comment } from "../../graphql/types"

type CommentVoteProps = {
  comment: Comment
  queryKey: any[]
  testid: string
}

const CommentVote = ({ comment, queryKey, testid }: CommentVoteProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const commentVoteMutation = useCommentVoteMutation({ comment, queryKey })

  const vote = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, like: boolean) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate("/login")
      return
    }

    commentVoteMutation.last_updated.current = new Date().toISOString()
    commentVoteMutation.sent_requests.current++
    commentVoteMutation.mutate({ commentId: comment.id, like })
  }

  return (
    <div className="flex items-center gap-1">
      <div
        data-testid={`${testid}-comment-upvote`}
        onClick={(e) => vote(e, true)}
        className="group/upvote rounded-full p-[5px] hover:bg-upvote-hover hover:cursor-pointer"
      >
        {comment.voteStatus == VoteStatus.Like ? (
          <BiSolidUpvote data-testid={`${testid}-upvote-icon`} className="w-[16px] h-[16px] text-upvote-green" />
        ) : (
          <>
            <BiUpvote className="w-[16px] h-[16px] group-hover/upvote:hidden" />
            <BiSolidUpvote
              data-testid={`${testid}-upvote-icon-hover`}
              className="w-[16px] h-[16px] hidden group-hover/upvote:block text-upvote-green"
            />
          </>
        )}
      </div>
      <span data-testid={`${testid}-vote-sum`} className="text-sm font-semibold">
        {comment.voteSum}
      </span>
      <div
        data-testid={`${testid}-comment-downvote`}
        onClick={(e) => vote(e, false)}
        className="group/upvote rounded-full p-[5px] hover:bg-upvote-hover hover:cursor-pointer"
      >
        {comment.voteStatus == VoteStatus.Dislike ? (
          <BiSolidDownvote data-testid={`${testid}-downvote-icon`} className="w-[16px] h-[16px] text-red-500" />
        ) : (
          <>
            <BiDownvote className="w-[16px] h-[16px] group-hover/upvote:hidden" />
            <BiSolidDownvote
              data-testid={`${testid}-downvote-icon-hover`}
              className="w-[16px] h-[16px] hidden group-hover/upvote:block text-red-500"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default CommentVote

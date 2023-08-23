import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import useCommentVoteMutation from "./useCommentVoteMutation"
import { VoteStatus } from "../../graphql_codegen/graphql"
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi"
import type { Comment } from "../../graphql/types"

type CommentVoteProps = {
  comment: Comment
  queryKey: any[]
}

const CommentVote = ({ comment, queryKey }: CommentVoteProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const commentVoteMutation = useCommentVoteMutation({ comment, queryKey })

  const vote = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    like: boolean
  ) => {
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
        onClick={(e) => vote(e, true)}
        className="group/upvote rounded-full p-[5px] hover:bg-upvote-hover hover:cursor-pointer"
      >
        {comment.voteStatus == VoteStatus.Like ? (
          <BiSolidUpvote className="w-[16px] h-[16px] text-upvote-green" />
        ) : (
          <>
            <BiUpvote className="w-[16px] h-[16px] group-hover/upvote:hidden" />
            <BiSolidUpvote className="w-[16px] h-[16px] hidden group-hover/upvote:block text-upvote-green" />
          </>
        )}
      </div>
      <span className="text-sm font-semibold">{comment.voteSum}</span>
      <div
        onClick={(e) => vote(e, false)}
        className="group/upvote rounded-full p-[5px] hover:bg-upvote-hover hover:cursor-pointer"
      >
        {comment.voteStatus == VoteStatus.Dislike ? (
          <BiSolidDownvote className="w-[16px] h-[16px] text-red-500" />
        ) : (
          <>
            <BiDownvote className="w-[16px] h-[16px] group-hover/upvote:hidden" />
            <BiSolidDownvote className="w-[16px] h-[16px] hidden group-hover/upvote:block text-red-500" />
          </>
        )}
      </div>
    </div>
  )
}

export default CommentVote

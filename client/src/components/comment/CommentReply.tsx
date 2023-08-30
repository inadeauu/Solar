import moment from "moment"
import type { Comment } from "../../graphql/types"
import CommentVote from "./CommentVote"
import { useContext } from "react"
import { CommentContext } from "../../contexts/CommentContext"
import { useNavigate } from "react-router-dom"
import { translator } from "../../utils/uuid"
import { useAuth } from "../../hooks/useAuth"

type CommentReplyType = {
  comment: Comment
  parentId: string
}

export const CommentReply = ({ comment, parentId }: CommentReplyType) => {
  const { user } = useAuth()
  const { commentOrderByType } = useContext(CommentContext)
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-[6px] px-[5px]">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 text-xs">
            <span
              className="text-black font-medium hover:underline hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(`/profile/${comment.owner.username}`)
              }}
            >
              {comment.owner.username}
            </span>
            {" • "}
            {moment(comment.created_at).fromNow()}
          </span>
          {user?.id == comment.owner.id && (
            <button
              onClick={() => {
                navigate(`/comments/${translator.fromUUID(comment.id)}/edit`)
              }}
              className="btn_blue text-sm py-1 px-3"
            >
              Edit
            </button>
          )}
        </div>
        <p className="text-sm font-light text-neutral-800">{comment.body}</p>
      </div>
      <CommentVote
        comment={comment}
        queryKey={["commentRepliesFeed", parentId, commentOrderByType]}
      />
    </div>
  )
}

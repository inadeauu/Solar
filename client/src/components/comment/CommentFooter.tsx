import type { Comment } from "../../graphql/types"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { BiComment, BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi"
import CommentReplyForm from "./CommentReplyForm"
import CommentVote from "./CommentVote"
import CommentReplies from "./CommentRepliesFeed"
import { getReply } from "../../utils/utils"
import { CommentContext } from "../../contexts/CommentContext"

type CommentFooterProps = {
  comment: Comment
}

const CommentFooter = ({ comment }: CommentFooterProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reply, setReply] = useState<boolean>(false)
  const [showReplies, setShowReplies] = useState<boolean>(false)

  const { commentOrderByType } = useContext(CommentContext)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <CommentVote
          comment={comment}
          queryKey={["postCommentFeed", comment.post.id, commentOrderByType]}
        />
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()

            if (!user) {
              navigate("/login")
              return
            }

            setReply((prev) => !prev)
          }}
          className="flex gap-[6px] rounded-full text-sm py-1 px-3 hover:cursor-pointer items-center hover:bg-post-icon"
        >
          <BiComment className="w-[14px] h-[14px] mt-[1px]" />
          Reply
        </button>
      </div>
      {reply && <CommentReplyForm comment={comment} setOpen={setReply} />}
      {comment.replyCount > 0 && (
        <button
          onClick={() => {
            setShowReplies((prev) => !prev)
          }}
          className="flex items-center gap-2 text-sm text-blue-500 px-[5px] w-fit"
        >
          {showReplies ? (
            <BiSolidDownArrow className="w-3 h-3" />
          ) : (
            <BiSolidUpArrow className="w-3 h-3" />
          )}
          {comment.replyCount} {getReply(comment.replyCount)}
        </button>
      )}
      {showReplies && <CommentReplies comment={comment} />}
    </div>
  )
}

export default CommentFooter

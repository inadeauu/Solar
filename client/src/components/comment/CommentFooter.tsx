import type { Comment } from "../../graphql/types"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { BiComment } from "react-icons/bi"
import CommentReplyForm from "./CommentReplyForm"
import CommentVote from "./CommentVote"

type CommentFooterProps = {
  comment: Comment
  queryKey: any[]
}

const CommentFooter = ({ comment, queryKey }: CommentFooterProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reply, setReply] = useState<boolean>(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1">
        <CommentVote comment={comment} queryKey={queryKey} />
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
    </div>
  )
}

export default CommentFooter

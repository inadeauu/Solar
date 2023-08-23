import moment from "moment"
import type { Comment } from "../../graphql/types"
import CommentVote from "./CommentVote"

type CommentReplyType = {
  comment: Comment
  queryKey: any[]
}

export const CommentReply = ({ comment, queryKey }: CommentReplyType) => {
  return (
    <div className="bg-white border border-neutral-300 rounded-lg py-4 px-[11px]">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-[6px] px-[5px]">
          <span className="text-neutral-500 text-xs">
            <span
              className="text-black font-medium hover:underline hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              {comment.owner.username}
            </span>
            {" • "}
            {moment(comment.created_at).fromNow()}
          </span>
          <p className="text-sm font-light text-neutral-800">{comment.body}</p>
        </div>
        <CommentVote comment={comment} queryKey={queryKey} />
      </div>
    </div>
  )
}

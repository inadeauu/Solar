import type { Comment } from "../../graphql/types"
import moment from "moment"
import CommentFooter from "./CommentFooter"
import CommentReplies from "./CommentRepliesFeed"
import { useState } from "react"
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi"

type CommentProps = {
  comment: Comment
  innerRef?: React.LegacyRef<HTMLDivElement> | undefined
  queryKey: any[]
}

const Comment = ({ comment, innerRef, queryKey }: CommentProps) => {
  const [showReplies, setShowReplies] = useState<boolean>(false)

  return (
    <div
      ref={innerRef}
      className="bg-white border border-neutral-300 rounded-lg py-4 px-[11px]"
    >
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
        <CommentFooter comment={comment} queryKey={queryKey} />
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
            {comment.replyCount} Replies
          </button>
        )}
        {showReplies && <CommentReplies comment={comment} />}
      </div>
    </div>
  )
}

export default Comment

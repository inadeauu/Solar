import type { Comment } from "../../graphql/types"
import moment from "moment"
import CommentFooter from "./CommentFooter"

type CommentProps = {
  comment: Comment
  innerRef?: React.LegacyRef<HTMLDivElement> | undefined
  queryKey: any[]
}

const Comment = ({ comment, innerRef, queryKey }: CommentProps) => {
  return (
    <div
      ref={innerRef}
      className="bg-white border border-neutral-300 rounded-lg py-4 px-[10px]"
    >
      <div className="flex flex-col gap-[6px] px-[6px]">
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
    </div>
  )
}

export default Comment

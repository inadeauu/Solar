import { useNavigate } from "react-router-dom"
import type { ProfileComment } from "../../../../graphql/types"
import moment from "moment"
import { translator } from "../../../../utils/uuid"
import { BiDownvote, BiUpvote } from "react-icons/bi"
import { getReply } from "../../../../utils/utils"
import { useAuth } from "../../../../hooks/useAuth"

type ProfileCommentProps = {
  comment: ProfileComment
  innerRef?: React.LegacyRef<HTMLDivElement> | undefined
}

const ProfileComment = ({ comment, innerRef }: ProfileCommentProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div
      ref={innerRef}
      className="bg-white border border-neutral-300 rounded-lg py-4 px-[11px]"
    >
      <div className="flex flex-col gap-[2px] px-[5px]">
        <div className="flex flex-col gap-[2px] text-neutral-500 text-xs">
          <span>
            <span
              className="text-black font-medium hover:underline hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(`/profile/${comment.owner.username}`)
              }}
            >
              {comment.owner.username}
            </span>{" "}
            commented on{" "}
            <span
              className="hover:underline text-neutral-700 hover:cursor-pointer break-all line-clamp-1"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(`/posts/${translator.fromUUID(comment.post.id)}`)
              }}
            >
              {comment.post.title}
            </span>
          </span>
          <div>
            Posted in{" "}
            <span
              className="text-black font-semibold hover:underline hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(
                  `/communities/${translator.fromUUID(
                    comment.post.community.id
                  )}`
                )
              }}
            >
              {comment.post.community.title}
            </span>
            {" • "}
            Posted by{" "}
            <span
              className="hover:underline hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(`/profile/${comment.post.owner.username}`)
              }}
            >
              {comment.post.owner.username}
            </span>
            {" • "}
            {moment(comment.post.created_at).fromNow()}
          </div>
          <hr />
        </div>
        <div>
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
          <p className="text-sm font-light text-neutral-800">{comment.body}</p>
        </div>
        <div className="flex items-center text-sm gap-4 mt-2 justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BiUpvote />
              {comment.voteSum}
              <BiDownvote />
            </div>
            {!comment.parent && (
              <div>
                {comment.replyCount} {getReply(comment.replyCount)}
              </div>
            )}
          </div>
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
      </div>
    </div>
  )
}

export default ProfileComment

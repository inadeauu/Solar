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
  testid: string
}

const ProfileComment = ({ comment, innerRef, testid }: ProfileCommentProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div ref={innerRef} className="bg-white border border-neutral-300 rounded-lg py-4 px-[11px]">
      <div className="flex flex-col gap-[2px] px-[5px]">
        <div className="flex flex-col gap-[2px] text-neutral-500 text-xs">
          <span>
            <span data-testid={`${testid}-username`} className="text-black font-medium">
              {comment.owner.username}
            </span>{" "}
            commented on{" "}
            <span
              data-testid={`${testid}-post-title`}
              className="hover:underline text-neutral-700 hover:cursor-pointer break-all"
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
              data-testid={`${testid}-community-title`}
              className="text-black font-semibold hover:underline hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(`/communities/${translator.fromUUID(comment.post.community.id)}`)
              }}
            >
              {comment.post.community.title}
            </span>
            {" • "}
            Posted by <span data-testid={`${testid}-posted-by`}>{comment.post.owner.username}</span>
            {" • "}
            {moment(comment.post.created_at).fromNow()}
          </div>
          <hr />
        </div>
        <div>
          <span className="text-neutral-500 text-xs">
            <span data-testid={`${testid}-comment-owner`} className="text-black font-medium">
              {comment.owner.username}
            </span>
            {" • "}
            {moment(comment.created_at).fromNow()}
          </span>
          <p data-testid={`${testid}-comment-body`} className="text-sm font-light text-neutral-800">
            {comment.body}
          </p>
        </div>
        <div className="flex items-center text-sm gap-4 mt-2 justify-between">
          <div className="flex items-center gap-3">
            <div data-testid={`${testid}-vote-sum`} className="flex items-center gap-2">
              <BiUpvote />
              {comment.voteSum}
              <BiDownvote />
            </div>
            {!comment.parent && (
              <div data-testid={`${testid}-reply-count`}>
                {comment.replyCount} {getReply(comment.replyCount)}
              </div>
            )}
          </div>
          {user?.id == comment.owner.id && (
            <button
              data-testid={`${testid}-edit-button`}
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

import moment from "moment"
import { User } from "../../../graphql/types"
import { pluralize } from "../../../utils/utils"
import { useAuth } from "../../../hooks/useAuth"
import { useNavigate } from "react-router-dom"

type ProfileHeaderProps = {
  user: User
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const { user: loggedInUser } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-2 bg-white border border-neutral-300 rounded-lg p-4 md:hidden">
      <div className="flex items-center gap-4 justify-between break-words">
        <h1 className="text-lg font-semibold min-w-0">{user.username}</h1>
        {loggedInUser?.id == user.id && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              navigate("/settings")
            }}
            className="btn_blue py-[2px] px-3"
          >
            Edit
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1 break-words">
        <span className="text-sm text-neutral-500">
          Joined {moment(user.created_at).format("MM/DD/YYYY")}
        </span>
        <div className="flex gap-1 text-neutral-500 text-sm">
          <span>
            {user.postsCount} {pluralize(user.postsCount, "Post")}
          </span>
          {"•"}
          <span>
            {user.commentsCount} {pluralize(user.commentsCount, "Comment")}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader

import moment from "moment"
import { User } from "../../../graphql/types"
import { pluralize } from "../../../utils/utils"
import { useAuth } from "../../../hooks/useAuth"
import { useNavigate } from "react-router-dom"

type ProfileSidebarProps = {
  user: User
}

const ProfileSidebar = ({ user }: ProfileSidebarProps) => {
  const { user: loggedInUser } = useAuth()
  const navigate = useNavigate()

  return (
    <aside
      data-testid="profile-sidebar"
      className="p-4 sticky top-[80px] bg-white w-[300px] shrink-0 h-fit rounded-lg border border-neutral-300 md-max:hidden"
    >
      <div className="flex flex-col gap-2 break-words">
        <h1 data-testid="sidebar-username" className="font-semibold text-lg">
          {user.username}
        </h1>
        <div className="flex flex-col gap-1 text-neutral-500 text-sm">
          <span data-testid="sidebar-joined">Joined {moment(user.created_at).format("MM/DD/YYYY")}</span>
          <span data-testid="sidebar-post-count">
            {user.postsCount} {pluralize(user.postsCount, "Post")}
          </span>
          <span data-testid="sidebar-comment-count">
            {user.commentsCount} {pluralize(user.commentsCount, "Comment")}
          </span>
        </div>
        {loggedInUser?.id == user.id && (
          <button
            data-testid="sidebar-edit-button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              navigate("/settings")
            }}
            className="btn_blue py-[2px]"
          >
            Edit
          </button>
        )}
      </div>
    </aside>
  )
}

export default ProfileSidebar

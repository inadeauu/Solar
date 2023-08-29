import moment from "moment"
import { User } from "../../../graphql/types"
import { pluralize } from "../../../utils/utils"

type ProfileSidebarProps = {
  user: User
}

const ProfileSidebar = ({ user }: ProfileSidebarProps) => {
  return (
    <aside className="p-4 sticky top-[80px] bg-white w-[300px] shrink-0 h-fit rounded-lg border border-neutral-300 md-max:hidden">
      <div className="flex flex-col gap-2 break-words">
        <h1 className="font-semibold text-lg">{user.username}</h1>
        <div className="flex flex-col gap-1 text-neutral-500 text-sm">
          <span>Joined {moment(user.created_at).format("MM/DD/YYYY")}</span>
          <span>
            {user.postsCount} {pluralize(user.postsCount, "Post")}
          </span>
          <span>
            {user.commentsCount} {pluralize(user.commentsCount, "Comment")}
          </span>
        </div>
      </div>
    </aside>
  )
}

export default ProfileSidebar

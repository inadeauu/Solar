import moment from "moment"
import { User } from "../../../graphql/types"
import { pluralize } from "../../../utils/utils"

type ProfileHeaderProps = {
  user: User
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 bg-white border border-neutral-300 rounded-lg p-4 md:hidden">
      <div className="flex flex-col gap-1 break-words">
        <h1 className="text-lg font-semibold">{user.username}</h1>
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

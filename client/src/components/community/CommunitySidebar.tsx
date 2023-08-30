import { Link, useNavigate } from "react-router-dom"
import { pluralize } from "../../utils/utils"
import JoinCommunityButton from "./CommunityJoinButton"
import moment from "moment"
import type { Community } from "../../graphql/types"
import { useAuth } from "../../hooks/useAuth"
import { translator } from "../../utils/uuid"

type CommunitySidebarProps = {
  community: Community
}

const CommunitySidebar = ({ community }: CommunitySidebarProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="p-4 sticky top-[80px] bg-white w-[300px] shrink-0 h-fit rounded-lg border border-neutral-300 md-max:hidden">
      <div className="flex flex-col gap-4 break-words">
        <h1 className="font-semibold">{community.title}</h1>
        <div className="flex flex-col gap-1 text-neutral-500 text-sm">
          <span>
            Created {moment(community.created_at).format("MM/DD/YYYY")}
          </span>
          <span>
            {community.memberCount} {pluralize(community.memberCount, "Member")}
          </span>
          <span>
            {community.postCount} {pluralize(community.postCount, "Post")}
          </span>
          <span>
            Owner:{" "}
            <Link
              to={`/profile/${community.owner.username}`}
              className="text-black font-medium hover:underline"
            >
              {community.owner.username}
            </Link>
          </span>
        </div>
        {community.owner.id !== user?.id ? (
          <JoinCommunityButton className="py-[2px]" community={community} />
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              navigate(
                `/communities/${translator.fromUUID(community.id)}/settings`
              )
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

export default CommunitySidebar

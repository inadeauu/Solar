import CommunityJoinButton from "./CommunityJoinButton"
import { pluralize } from "../../utils/utils"
import { Link, useNavigate } from "react-router-dom"
import moment from "moment"
import type { Community } from "../../graphql/types"
import { useAuth } from "../../hooks/useAuth"
import { translator } from "../../utils/uuid"

type CommunityHeaderProps = {
  community: Community
}

const CommunityHeader = ({ community }: CommunityHeaderProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div
      data-testid="community-header"
      className="flex flex-col gap-2 bg-white border border-neutral-300 rounded-lg p-4 md:hidden"
    >
      <div className="flex gap-4 items-center justify-between">
        <h1 data-testid="community-header-title" className="font-semibold text-xl min-w-0">
          {community.title}
        </h1>
        {community.owner.id !== user?.id ? (
          <CommunityJoinButton data-testid="community-header-join-button" className="py-1 px-3" community={community} />
        ) : (
          <button
            data-testid="community-header-edit-button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              navigate(`/communities/${translator.fromUUID(community.id)}/settings`)
            }}
            className="btn_blue py-1 px-3"
          >
            Edit
          </button>
        )}
      </div>
      <span className="flex flex-col gap-1 text-neutral-500 text-sm xs-max:text-xs">
        <span data-testid="community-header-created-at">
          Created {moment(community.created_at).format("MM/DD/YYYY")}
        </span>
        <span data-testid="community-header-posts-and-members">
          {community.memberCount} {pluralize(community.memberCount, "Member")}
          {" • "}
          {community.postCount} {pluralize(community.postCount, "Post")}
        </span>
        <span>
          Owner:{" "}
          <Link
            data-testid="community-header-owner"
            to={`/profile/${community.owner.username}`}
            className="text-black font-medium hover:underline"
          >
            {community.owner.username}
          </Link>
        </span>
      </span>
    </div>
  )
}

export default CommunityHeader

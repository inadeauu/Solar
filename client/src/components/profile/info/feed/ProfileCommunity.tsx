import { Link, useNavigate } from "react-router-dom"
import { Community } from "../../../../graphql/types"
import { translator } from "../../../../utils/uuid"
import { pluralize } from "../../../../utils/utils"
import moment from "moment"
import { useAuth } from "../../../../hooks/useAuth"

type ProfileCommunityProps = {
  community: Community
  innerRef?: React.Ref<HTMLAnchorElement> | undefined
  testid: string
}

const ProfileCommunity = ({ community, innerRef, testid }: ProfileCommunityProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Link
      data-testid={`${testid}-link`}
      ref={innerRef}
      to={`/communities/${translator.fromUUID(community.id)}`}
      className="bg-white border border-neutral-300 rounded-lg p-4 hover:cursor-pointer hover:border-black"
    >
      <div className="flex flex-col">
        <div className="flex gap-4 items-center justify-between">
          <span data-testid={`${testid}-community-title`} className="text-lg font-medium min-w-0">
            {community.title}
          </span>
          {user?.id == community.owner.id && (
            <button
              data-testid={`${testid}-edit-button`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()

                navigate(`/communities/${translator.fromUUID(community.id)}/settings`)
              }}
              className="btn_blue text-sm py-[2px] px-3"
            >
              Edit
            </button>
          )}
        </div>
        <span className="text-neutral-500 text-sm">
          <span data-testid={`${testid}-created`}>Created {moment(community.created_at).format("MM/DD/YYYY")}</span>
          <div data-testid={`${testid}-post-member-count`} className="flex gap-2">
            <span>
              {community.postCount} {pluralize(community.postCount, "Post")}
            </span>
            {" • "}
            <span>
              {community.memberCount} {pluralize(community.memberCount, "Member")}
            </span>
          </div>
        </span>
      </div>
    </Link>
  )
}

export default ProfileCommunity

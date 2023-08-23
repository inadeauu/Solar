import { Link } from "react-router-dom"
import { pluralize } from "../../utils/utils"
import JoinCommunityButton from "./CommunityJoinButton"
import moment from "moment"
import type { Community } from "../../graphql/types"

type CommunitySidebarProps = {
  community: Community
}

const CommunitySidebar = ({ community }: CommunitySidebarProps) => {
  return (
    <aside className="p-4 sticky top-[80px] bg-white w-[300px] shrink-0 h-fit rounded-lg border border-neutral-300 md-max:hidden">
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold break-words">{community.title}</h1>
        <div className="flex flex-col gap-1 text-neutral-500 text-sm min-w-0 break-words">
          <span>
            Created {moment(community.created_at).format("MM/DD/YYYY")}
          </span>
          <span>
            {community.memberCount} {pluralize(community.memberCount, "Member")}
          </span>
          <span>
            {community.postCount} {pluralize(community.postCount, "Post")}
          </span>
          <span className="text-ellipsis whitespace-nowrap overflow-hidden">
            Owner:{" "}
            <Link
              to="/signup"
              className="text-black font-medium hover:underline"
            >
              {community.owner.username}
            </Link>
          </span>
        </div>
        <JoinCommunityButton className="py-[2px]" community={community} />
      </div>
    </aside>
  )
}

export default CommunitySidebar

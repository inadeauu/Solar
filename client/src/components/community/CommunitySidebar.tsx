import { Link } from "react-router-dom"
import { pluralize } from "../../utils/utils"
import { CommunityQuery } from "../../gql/graphql"
import JoinCommunityButton from "./CommunityJoinButton"
import moment from "moment"

type CommunitySidebarProps = {
  community: NonNullable<CommunityQuery["community"]>
}

const CommunitySidebar = ({ community }: CommunitySidebarProps) => {
  return (
    <aside className="p-4 sticky top-[80px] bg-white w-[300px] h-fit rounded-lg border border-neutral-300 md-max:hidden">
      <div className="flex gap-4 items-center justify-between mb-2">
        <h1 className="font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
          {community.title}
        </h1>
        <JoinCommunityButton community={community} />
      </div>
      <div className="flex flex-col gap-1 text-neutral-500 text-sm">
        <span className="break-words">
          Created {moment(community.created_at).format("MM/DD/YYYY")}
        </span>
        <span className="break-words">
          {community.memberCount} {pluralize(community.memberCount, "Member")}
        </span>
        <span className="break-words">
          {community.postCount} {pluralize(community.postCount, "Post")}
        </span>
        <span className="text-ellipsis whitespace-nowrap overflow-hidden">
          Owner:{" "}
          <Link to="/signup" className="text-black font-medium hover:underline">
            {community.owner.username}
          </Link>
        </span>
      </div>
    </aside>
  )
}

export default CommunitySidebar

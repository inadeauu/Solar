import CommunityJoinButton from "./CommunityJoinButton"
import { pluralize } from "../../utils/utils"
import { CommunityQuery } from "../../gql/graphql"
import { Link } from "react-router-dom"
import moment from "moment"

type CommunityHeaderProps = {
  community: NonNullable<CommunityQuery["community"]>
}

const CommunityHeader = ({ community }: CommunityHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 bg-white border border-neutral-300 rounded-lg p-4 md:hidden">
      <div className="flex justify-between">
        <h1 className="font-semibold text-xl text-ellipsis whitespace-nowrap overflow-hidden">
          {community.title}
        </h1>
        <CommunityJoinButton community={community} />
      </div>
      <span className="flex flex-col gap-1 text-neutral-500 text-sm xs-max:text-xs">
        <span className="break-words">
          Created {moment(community.created_at).format("MM/DD/YYYY")}
        </span>
        <span className="break-words">
          {community.memberCount} {pluralize(community.memberCount, "Member")}
          {" • "}
          {community.postCount} {pluralize(community.postCount, "Post")}
        </span>
        <span className="text-ellipsis whitespace-nowrap overflow-hidden">
          Owner:{" "}
          <Link to="/signup" className="text-black font-medium hover:underline">
            {community.owner.username}
          </Link>
        </span>
      </span>
    </div>
  )
}

export default CommunityHeader

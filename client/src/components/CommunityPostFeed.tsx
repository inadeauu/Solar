import { CommunityQuery } from "../gql/graphql"

type CommunityPostFeedProps = {
  community: NonNullable<CommunityQuery["community"]>
}

const CommunityPostFeed = ({ community }: CommunityPostFeedProps) => {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
      No Posts...
    </div>
  )
}

export default CommunityPostFeed

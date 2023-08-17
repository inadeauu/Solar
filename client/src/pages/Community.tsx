import { Link, Navigate, useParams } from "react-router-dom"
import { graphql } from "../gql"
import { translator } from "../utils/uuid"
import { useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { ImSpinner11 } from "react-icons/im"
import { pluralize } from "../utils/utils"
import CommunitySidebar from "../components/CommunitySidebar"
import CommunityCreatePost from "../components/CommunityCreatePost"
import CommunityPostFeed from "../components/CommunityPostFeed"
import JoinCommunityButton from "../components/JoinCommunityButton"

const getCommunityDocument = graphql(/* GraphQL */ `
  query Community($input: CommunityInput!) {
    community(input: $input) {
      id
      memberCount
      postCount
      inCommunity
      owner {
        id
        username
      }
      title
      created_at
      updated_at
    }
  }
`)

const Community = () => {
  const { title, id } = useParams()
  const uuid = translator.toUUID(id!)

  const { data, isLoading } = useQuery({
    queryKey: [uuid],
    queryFn: () =>
      graphQLClient.request(getCommunityDocument, {
        input: {
          id: uuid,
        },
      }),
  })

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  } else if (!data?.community || data.community.title !== title) {
    return <Navigate to="/404-not-found" />
  }

  return (
    <section className="flex gap-6">
      <div className="flex flex-col gap-2 md:grow md-max:w-full">
        <div className="flex flex-col gap-2 bg-gray-100 border border-gray-300 rounded-lg p-4 md:hidden">
          <div className="flex justify-between">
            <h1 className="font-semibold text-xl text-ellipsis whitespace-nowrap overflow-hidden">
              {data.community.title}
            </h1>
            <JoinCommunityButton community={data.community} />
          </div>
          <span className="flex flex-col gap-1 text-gray-500 text-sm xs-max:text-xs">
            <span className="break-words">
              {data.community.memberCount}{" "}
              {pluralize(data.community.memberCount, "Member")}
              {" • "}
              {data.community.postCount}{" "}
              {pluralize(data.community.postCount, "Post")}
            </span>
            <span className="text-ellipsis whitespace-nowrap overflow-hidden">
              Owner:{" "}
              <Link
                to="/signup"
                className="text-black font-medium hover:underline"
              >
                {data.community.owner.username}
              </Link>
            </span>
          </span>
        </div>
        <CommunityCreatePost community={data.community} />
        <CommunityPostFeed community={data.community} />
      </div>
      <CommunitySidebar community={data.community} />
    </section>
  )
}

export default Community

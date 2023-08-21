import { Navigate, useParams } from "react-router-dom"
import { graphql } from "../graphql_codegen/gql"
import { translator } from "../utils/uuid"
import { useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { ImSpinner11 } from "react-icons/im"
import CommunitySidebar from "../components/community/CommunitySidebar"
import CommunityPostFeed from "../components/community/CommunityPostFeed"
import CommunityPostForm from "../components/community/CommunityPostForm"
import CommunityHeader from "../components/community/CommunityHeader"

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

const CommunityPage = () => {
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
      <div className="flex flex-col gap-5 md:grow md-max:w-full break-words min-w-0">
        <CommunityHeader community={data.community} />
        <CommunityPostForm community={data.community} />
        <CommunityPostFeed community={data.community} />
      </div>
      <CommunitySidebar community={data.community} />
    </section>
  )
}

export default CommunityPage

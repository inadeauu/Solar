import { Navigate, useParams } from "react-router-dom"
import { graphql } from "../graphql_codegen/gql"
import { useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { ImSpinner11 } from "react-icons/im"
import ProfileSidebar from "../components/profile/info/ProfileSidebar"
import ProfileHeader from "../components/profile/info/ProfileHeader"
import ProfileFeed from "../components/profile/info/ProfileFeed"

const getUserDocument = graphql(/* GraphQL */ `
  query GetUser($input: UserInput!) {
    user(input: $input) {
      commentsCount
      created_at
      id
      postsCount
      provider
      updated_at
      username
    }
  }
`)

const ProfilePage = () => {
  const { username } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () =>
      graphQLClient.request(getUserDocument, {
        input: {
          username: username || "",
        },
      }),
  })

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  } else if (!data?.user) {
    return <Navigate to="/404-not-found" />
  }

  return (
    <section className="flex gap-6">
      <div className="flex flex-col gap-5 md:grow md-max:w-full min-w-0 break-words">
        <ProfileHeader user={data.user} />
        <ProfileFeed user={data.user} />
      </div>
      <ProfileSidebar user={data.user} />
    </section>
  )
}

export default ProfilePage

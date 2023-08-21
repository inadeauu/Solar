import { Navigate, useParams } from "react-router-dom"
import { graphql } from "../graphql_codegen/gql"
import { translator } from "../utils/uuid"
import { useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { ImSpinner11 } from "react-icons/im"
import Post from "../components/post/single/Post"

const getPostDocument = graphql(/* GraphQL */ `
  query SinglePost($input: PostInput!) {
    post(input: $input) {
      id
      body
      created_at
      title
      commentCount
      voteSum
      voteStatus
      community {
        id
        title
      }
      owner {
        id
        username
      }
    }
  }
`)

const PostPage = () => {
  const { title, id } = useParams()
  const uuid = translator.toUUID(id!)

  const { data, isLoading } = useQuery({
    queryKey: [uuid],
    queryFn: () =>
      graphQLClient.request(getPostDocument, {
        input: {
          id: uuid,
        },
      }),
  })

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  } else if (!data?.post || data.post.title !== title) {
    return <Navigate to="/404-not-found" />
  }

  return <Post post={data.post} />
}

export default PostPage

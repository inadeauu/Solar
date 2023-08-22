import { Navigate, useParams } from "react-router-dom"
import { graphql } from "../graphql_codegen/gql"
import { translator } from "../utils/uuid"
import { useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { ImSpinner11 } from "react-icons/im"
import Post from "../components/post/single/Post"
import CommunitySidebar from "../components/community/CommunitySidebar"
import { useCommunity } from "../graphql/useQuery"
import PostCommentForm from "../components/post/single/PostCommentForm"
import PostCommentFeed from "../components/post/single/PostCommentFeed"

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

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: [uuid],
    queryFn: () =>
      graphQLClient.request(getPostDocument, {
        input: {
          id: uuid,
        },
      }),
  })

  const communityId = post?.post?.community.id

  const { data: community, isLoading: communityLoading } = useCommunity(
    communityId,
    { enabled: !!communityId }
  )

  if (postLoading || communityLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  } else if (
    !post?.post ||
    !community?.community ||
    post.post.title !== title
  ) {
    return <Navigate to="/404-not-found" />
  }

  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-5 md:grow md-max:w-full break-words min-w-0">
        <Post post={post.post} />
        <PostCommentForm post={post.post} />
        <PostCommentFeed post={post.post} />
      </div>
      <CommunitySidebar community={community.community} />
    </div>
  )
}

export default PostPage

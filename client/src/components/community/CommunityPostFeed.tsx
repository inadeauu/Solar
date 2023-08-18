import { CommunityQuery } from "../../gql/graphql"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { graphql } from "../../gql"
import { graphQLClient } from "../../utils/graphql"
import { useEffect } from "react"
import { ImSpinner11 } from "react-icons/im"
import Post from "../post/Post"

type CommunityPostFeedProps = {
  community: NonNullable<CommunityQuery["community"]>
}

const getPostFeedDocument = graphql(/* GraphQL */ `
  query PostFeed($input: PostsInput!) {
    posts(input: $input) {
      edges {
        node {
          body
          community {
            id
            title
          }
          created_at
          id
          owner {
            id
            username
          }
          title
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`)

const CommunityPostFeed = ({ community }: CommunityPostFeedProps) => {
  const { ref, inView } = useInView()

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["communityPostFeed", community.id],
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getPostFeedDocument, {
        input: {
          filters: { communityId: community.id },
          paginate: { first: 10, after: pageParam },
        },
      })
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.posts.pageInfo.endCursor
      },
    }
  )

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  }

  return (
    <>
      {isSuccess &&
        data.pages.map((page) =>
          page.posts.edges.map((edge, i) => {
            return (
              <Post
                innerRef={page.posts.edges.length === i + 1 ? ref : undefined}
                key={edge.node.id}
                post={edge.node}
              />
            )
          })
        )}
      {isFetchingNextPage && (
        <ImSpinner11 className="mt-2 animate-spin h-10 w-10" />
      )}
    </>
  )
}

export default CommunityPostFeed

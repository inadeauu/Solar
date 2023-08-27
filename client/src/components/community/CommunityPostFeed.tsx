import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { graphql } from "../../graphql_codegen/gql"
import { graphQLClient } from "../../utils/graphql"
import { useEffect } from "react"
import { ImSpinner11 } from "react-icons/im"
import Post from "../post/feed/Post"
import type { Community } from "../../graphql/types"
import { PostOrderByType } from "../../graphql_codegen/graphql"

type CommunityPostFeedProps = {
  community: Community
  postOrder: PostOrderByType
  queryKey: any[]
}

const getPostFeedDocument = graphql(/* GraphQL */ `
  query PostFeed($input: PostsInput!) {
    posts(input: $input) {
      edges {
        node {
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
      pageInfo {
        endCursor {
          id
          voteSum
          created_at
        }
        hasNextPage
      }
    }
  }
`)

const CommunityPostFeed = ({
  community,
  postOrder,
  queryKey,
}: CommunityPostFeedProps) => {
  const { ref, inView } = useInView()

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    queryKey,
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getPostFeedDocument, {
        input: {
          filters: { communityId: community.id, orderBy: postOrder },
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

  if (isSuccess && !data.pages[0].posts.edges.length) {
    return (
      <span className="bg-white border border-neutral-300 rounded-lg p-4 text-medium">
        No posts
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {isSuccess &&
        data.pages.map((page) =>
          page.posts.edges.map((edge, i) => {
            return (
              <Post
                innerRef={page.posts.edges.length === i + 1 ? ref : undefined}
                key={edge.node.id}
                post={edge.node}
                queryKey={queryKey}
              />
            )
          })
        )}
      {isFetchingNextPage && (
        <ImSpinner11 className="mt-2 animate-spin h-10 w-10" />
      )}
    </div>
  )
}

export default CommunityPostFeed

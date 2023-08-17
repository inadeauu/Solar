import { CommunityQuery } from "../../gql/graphql"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { graphql } from "../../gql"
import { graphQLClient } from "../../utils/graphql"
import { useEffect } from "react"
import { ImSpinner11 } from "react-icons/im"
import { Link } from "react-router-dom"

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
          page.posts.edges.map((edge) => {
            return (
              <div
                key={edge.node.id}
                className="bg-gray-100 border border-gray-300 rounded-lg p-4 hover:bg-gray-200 hover:cursor-pointer"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-xs">
                    Posted by{" "}
                    <Link
                      to="#"
                      className="font-medium hover:underline hover:cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      {edge.node.owner.username}
                    </Link>
                    {""}
                  </span>
                  <span className="font-semibold text-lg">
                    {edge.node.title}
                  </span>
                </div>
              </div>
            )
          })
        )}
      <span ref={ref} />
      {isFetchingNextPage && (
        <ImSpinner11 className="mt-2 animate-spin h-10 w-10" />
      )}
    </>
  )
}

export default CommunityPostFeed

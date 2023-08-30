import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { graphQLClient } from "../../utils/graphql"
import { useContext, useEffect } from "react"
import { ImSpinner11 } from "react-icons/im"
import Post from "../post/feed/Post"
import type { Community } from "../../graphql/types"
import { CommunityContext } from "../../contexts/CommunityContext"
import { getPostFeedDocument } from "../../graphql/sharedDocuments"

type CommunityPostFeedProps = {
  community: Community
}

const CommunityPostFeed = ({ community }: CommunityPostFeedProps) => {
  const { ref, inView } = useInView()

  const { postOrderByType } = useContext(CommunityContext)

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["communityPostFeed", community.id, postOrderByType],
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getPostFeedDocument, {
        input: {
          filters: { communityId: community.id, orderBy: postOrderByType },
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
        No Posts
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
                communityFeed={true}
                innerRef={page.posts.edges.length === i + 1 ? ref : undefined}
                key={edge.node.id}
                post={edge.node}
                queryKey={["communityPostFeed", community.id, postOrderByType]}
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

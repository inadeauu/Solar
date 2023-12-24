import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { getPostOrderByType } from "../../utils/utils"
import { useInfiniteQuery } from "@tanstack/react-query"
import { graphQLClient } from "../../utils/graphql"
import { getPostFeedDocument } from "../../graphql/sharedDocuments"
import { ImSpinner11 } from "react-icons/im"
import Dropdown from "../misc/Dropdown"
import Post from "../post/feed/Post"

const HomeFeed = () => {
  const { ref, inView } = useInView()

  const [postOrderBy, setPostOrderBy] = useState<string>("New")

  const postOrderByType = getPostOrderByType(postOrderBy)

  const { data, isLoading, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["homePostFeed", postOrderByType],
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getPostFeedDocument, {
        input: {
          filters: {
            orderBy: postOrderByType,
          },
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
      <span data-testid="no-posts-text" className="bg-white border border-neutral-300 rounded-lg p-4 text-medium">
        No Posts
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropdown
        name="order"
        className="py-1"
        width="w-[65px]"
        items={["New", "Old", "Top", "Low"]}
        value={postOrderBy}
        setValue={setPostOrderBy}
      />
      <div data-testid="home-post-feed" className="flex flex-col gap-5">
        {isSuccess &&
          data.pages.map((page) =>
            page.posts.edges.map((edge, i) => {
              return (
                <Post
                  innerRef={page.posts.edges.length === i + 1 ? ref : undefined}
                  key={edge.node.id}
                  post={edge.node}
                  queryKey={["homePostFeed", postOrderByType]}
                />
              )
            })
          )}
        {isFetchingNextPage && <ImSpinner11 className="mt-2 animate-spin h-10 w-10" />}
        {!hasNextPage && <span>All posts loaded</span>}
      </div>
    </div>
  )
}

export default HomeFeed

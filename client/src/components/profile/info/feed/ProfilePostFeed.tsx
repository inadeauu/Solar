import { useInView } from "react-intersection-observer"
import { User } from "../../../../graphql/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { graphQLClient } from "../../../../utils/graphql"
import { getPostFeedDocument } from "../../../../graphql/sharedDocuments"
import { useEffect, useState } from "react"
import { ImSpinner11 } from "react-icons/im"
import Post from "../../../post/feed/Post"
import Dropdown from "../../../misc/Dropdown"
import { getPostOrderByType } from "../../../../utils/utils"

type ProfilePostFeedProps = {
  user: User
}

const ProfilePostFeed = ({ user }: ProfilePostFeedProps) => {
  const { ref, inView } = useInView()

  const [postOrderBy, setPostOrderBy] = useState<string>("New")

  const postOrderByType = getPostOrderByType(postOrderBy)

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["profilePostFeed", user.username, postOrderByType],
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getPostFeedDocument, {
        input: {
          filters: {
            userId: user.id,
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
      <span className="bg-white border border-neutral-300 rounded-lg p-4 text-medium">
        No posts
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <Dropdown
        className="py-1"
        width="w-[65px]"
        items={["New", "Old", "Top", "Low"]}
        value={postOrderBy}
        setValue={setPostOrderBy}
      />
      {isSuccess &&
        data.pages.map((page) =>
          page.posts.edges.map((edge, i) => {
            return (
              <Post
                insideCommunity={false}
                innerRef={page.posts.edges.length === i + 1 ? ref : undefined}
                key={edge.node.id}
                post={edge.node}
                queryKey={["profilePostFeed", user.username, postOrderByType]}
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

export default ProfilePostFeed

import { ImSpinner11 } from "react-icons/im"
import { User } from "../../../../graphql_codegen/graphql"
import Dropdown from "../../../misc/Dropdown"
import ProfileCommunity from "./ProfileCommunity"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { graphQLClient } from "../../../../utils/graphql"
import { getCommunityFeedDocument } from "../../../../graphql/sharedDocuments"
import { useInView } from "react-intersection-observer"

type ProfileCommunityFeedProps = {
  user: User
}

const ProfileCommunityFeed = ({ user }: ProfileCommunityFeedProps) => {
  const { ref, inView } = useInView()

  const [communityFilter, setCommunityFilter] = useState<string>("Owns")

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["profileCommunityFeed", user.username, communityFilter],
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getCommunityFeedDocument, {
        input: {
          filters: {
            ownerId: communityFilter == "Owns" ? user.id : undefined,
            memberId: communityFilter == "Member of" ? user.id : undefined,
          },
          paginate: { first: 10, after: pageParam },
        },
      })
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.communities.pageInfo.endCursor
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
    <div className="flex flex-col gap-5">
      <Dropdown
        className="py-1"
        width="w-[95px]"
        items={["Owns", "Member of"]}
        value={communityFilter}
        setValue={setCommunityFilter}
      />
      {isSuccess && data.pages[0].communities.edges.length ? (
        data.pages.map((page) =>
          page.communities.edges.map((edge, i) => {
            return (
              <ProfileCommunity
                innerRef={
                  page.communities.edges.length === i + 1 ? ref : undefined
                }
                key={edge.node.id}
                community={edge.node}
              />
            )
          })
        )
      ) : (
        <span className="bg-white border border-neutral-300 rounded-lg p-4 text-medium">
          No Communities
        </span>
      )}
      {isFetchingNextPage && (
        <ImSpinner11 className="mt-2 animate-spin h-10 w-10" />
      )}
    </div>
  )
}

export default ProfileCommunityFeed

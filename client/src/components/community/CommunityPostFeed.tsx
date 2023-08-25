import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { graphql } from "../../graphql_codegen/gql"
import { graphQLClient } from "../../utils/graphql"
import { useEffect, useState } from "react"
import { ImSpinner11 } from "react-icons/im"
import Post from "../post/feed/Post"
import type { Community } from "../../graphql/types"
import { PostOrderByType } from "../../graphql_codegen/graphql"
import Dropdown from "../misc/Dropdown"

type CommunityPostFeedProps = {
  community: Community
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
        }
        hasNextPage
      }
    }
  }
`)

const CommunityPostFeed = ({ community }: CommunityPostFeedProps) => {
  const { ref, inView } = useInView()
  const [postOrder, setPostOrder] = useState<string>("New")

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["communityPostFeed", community.id, postOrder],
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getPostFeedDocument, {
        input: {
          filters: { communityId: community.id, orderBy: getPostOrder() },
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

  const changePostOrder = (newOrder: string) => {
    setPostOrder(newOrder)
  }

  const getPostOrder = () => {
    switch (postOrder) {
      case "New":
        return PostOrderByType.New
      case "Old":
        return PostOrderByType.Old
      case "Top":
        return PostOrderByType.Top
      case "Low":
        return PostOrderByType.Low
      default:
        return PostOrderByType.New
    }
  }

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
        width="w-[70px] py-2"
        items={["New", "Old", "Top", "Low"]}
        value={postOrder}
        setValue={changePostOrder}
      />
      {isSuccess &&
        data.pages.map((page) =>
          page.posts.edges.map((edge, i) => {
            return (
              <Post
                innerRef={page.posts.edges.length === i + 1 ? ref : undefined}
                key={edge.node.id}
                post={edge.node}
                queryKey={["communityPostFeed", community.id, postOrder]}
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

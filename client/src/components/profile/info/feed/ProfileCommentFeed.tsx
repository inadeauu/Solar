import { useInView } from "react-intersection-observer"
import { User } from "../../../../graphql/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { graphQLClient } from "../../../../utils/graphql"
import { useEffect, useState } from "react"
import { ImSpinner11 } from "react-icons/im"
import ProfileComment from "./ProfileComment"
import { graphql } from "../../../../graphql_codegen/gql"
import Dropdown from "../../../misc/Dropdown"
import { getCommentOrderByType } from "../../../../utils/utils"

type ProfileCommentFeedProps = {
  user: User
}

const getProfileCommentFeedDocument = graphql(/* GraphQL */ `
  query ProfileCommentFeed($input: CommentsInput!) {
    comments(input: $input) {
      edges {
        node {
          body
          created_at
          id
          parent {
            id
          }
          post {
            id
            title
            owner {
              id
              username
            }
            community {
              id
              title
            }
            created_at
          }
          owner {
            id
            username
          }
          voteSum
          voteStatus
          replyCount
        }
      }
      pageInfo {
        endCursor {
          id
          created_at
          voteSum
        }
        hasNextPage
      }
    }
  }
`)

const ProfileCommentFeed = ({ user }: ProfileCommentFeedProps) => {
  const { ref, inView } = useInView()

  const [commentOrderBy, setCommentOrderBy] = useState<string>("New")
  const [commentFilter, setCommentFilter] = useState<string>("Top Level")

  const commentOrderByType = getCommentOrderByType(commentOrderBy)

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["profileCommentFeed", user.username, commentOrderByType, commentFilter],
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getProfileCommentFeedDocument, {
        input: {
          filters: {
            userId: user.id,
            orderBy: commentOrderByType,
            replies: commentFilter == "Reply",
          },
          paginate: { first: 10, after: pageParam },
        },
      })
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.comments.pageInfo.endCursor
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

  if (isSuccess && !data.pages[0].comments.edges.length) {
    return (
      <span className="bg-white border border-neutral-300 rounded-lg p-4 text-medium">
        No Comments
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4">
        <Dropdown
          className="py-1"
          width="w-[65px]"
          items={["New", "Old", "Top", "Low"]}
          value={commentOrderBy}
          setValue={setCommentOrderBy}
        />
        <Dropdown
          className="py-1"
          width="w-[95px]"
          items={["Top level", "Reply"]}
          value={commentFilter}
          setValue={setCommentFilter}
        />
      </div>
      {isSuccess &&
        data.pages.map((page) =>
          page.comments.edges.map((edge, i) => {
            return (
              <ProfileComment
                innerRef={
                  page.comments.edges.length === i + 1 ? ref : undefined
                }
                key={edge.node.id}
                comment={edge.node}
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

export default ProfileCommentFeed

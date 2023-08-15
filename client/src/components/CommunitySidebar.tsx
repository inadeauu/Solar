import { Link } from "react-router-dom"
import { pluralize } from "../utils/utils"
import { CommunityQuery, UserJoinCommunityInput } from "../gql/graphql"
import { useAuth } from "../utils/useAuth"
import { useNavigate } from "react-router-dom"
import { graphql } from "../gql"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"

type CommunitySidebarProps = {
  community: NonNullable<CommunityQuery["community"]>
}

const userJoinCommunityDocument = graphql(/* GraphQL */ `
  mutation UserJoinCommunity($input: UserJoinCommunityInput!) {
    userJoinCommunity(input: $input) {
      ... on UserJoinCommunitySuccess {
        __typename
        successMsg
        code
        inCommunity
      }
      ... on Error {
        __typename
        errorMsg
        code
      }
      ... on UserJoinCommunityInputError {
        inputErrors {
          communityId
        }
      }
    }
  }
`)

const CommunitySidebar = ({ community }: CommunitySidebarProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  console.log(community.inCommunity)

  const joinCommunity = useMutation({
    mutationFn: async ({ communityId }: UserJoinCommunityInput) => {
      return await graphQLClient.request(userJoinCommunityDocument, {
        input: { communityId },
      })
    },
    onSuccess: (data) => {
      if (
        data.userJoinCommunity.__typename == "AuthenticationError" ||
        data.userJoinCommunity.__typename == "UserJoinCommunityInputError"
      ) {
        // Handle error
      } else if (
        data.userJoinCommunity.__typename == "UserJoinCommunitySuccess"
      ) {
        const inCommunity = data.userJoinCommunity.inCommunity

        queryClient.setQueryData<CommunityQuery>([community.id], (oldData) =>
          oldData
            ? {
                ...oldData,
                community: {
                  ...community,
                  memberCount: inCommunity
                    ? oldData.community!.memberCount + 1
                    : oldData.community!.memberCount - 1,
                  inCommunity,
                },
              }
            : oldData
        )
      }
    },
  })

  return (
    <aside className="p-4 sticky bg-gray-100 w-[300px] h-fit rounded-lg border border-gray-300 md-max:hidden">
      <div className="flex gap-4 items-center justify-between mb-2">
        <h1 className="font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
          {community.title}
        </h1>
        <button
          className="btn_blue py-1 px-3"
          onClick={() => {
            if (!user) {
              navigate("/login")
            }

            joinCommunity.mutate({ communityId: community.id })
          }}
        >
          {!community.inCommunity ? "Join" : "Joined"}
        </button>
      </div>
      <div className="flex flex-col gap-1 text-gray-500 text-sm">
        <span className="break-words">
          {community.memberCount} {pluralize(community.memberCount, "Member")}
        </span>
        <span className="break-words">
          {community.postCount} {pluralize(community.postCount, "Post")}
        </span>
        <span className="text-ellipsis whitespace-nowrap overflow-hidden">
          Owner:{" "}
          <Link to="/signup" className="text-black font-medium hover:underline">
            {community.owner.username}
          </Link>
        </span>
      </div>
    </aside>
  )
}

export default CommunitySidebar

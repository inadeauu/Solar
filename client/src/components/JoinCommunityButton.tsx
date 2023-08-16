import { useNavigate } from "react-router-dom"
import { useAuth } from "../utils/useAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphql } from "../gql"
import { CommunityQuery, UserJoinCommunityInput } from "../gql/graphql"
import { graphQLClient } from "../utils/graphql"

const userJoinCommunityDocument = graphql(/* GraphQL */ `
  mutation UserJoinCommunity($input: UserJoinCommunityInput!) {
    userJoinCommunity(input: $input) {
      ... on UserJoinCommunitySuccess {
        __typename
        successMsg
        code
        inCommunity
      }
    }
  }
`)

type JoinCommunityButtonProps = {
  community: NonNullable<CommunityQuery["community"]>
}

const JoinCommunityButton = ({ community }: JoinCommunityButtonProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const joinCommunity = useMutation({
    mutationFn: async ({ communityId }: UserJoinCommunityInput) => {
      return await graphQLClient.request(userJoinCommunityDocument, {
        input: { communityId },
      })
    },
    onSuccess: (data) => {
      if (data.userJoinCommunity.__typename == "UserJoinCommunitySuccess") {
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
  )
}

export default JoinCommunityButton

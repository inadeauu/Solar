import { useNavigate } from "react-router-dom"
import { useAuth } from "../utils/useAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphql } from "../gql"
import { CommunityQuery, UserJoinCommunityInput } from "../gql/graphql"
import { graphQLClient } from "../utils/graphql"
import { useRef } from "react"

const userJoinCommunityDocument = graphql(/* GraphQL */ `
  mutation UserJoinCommunity($input: UserJoinCommunityInput!) {
    userJoinCommunity(input: $input) {
      ... on UserJoinCommunitySuccess {
        __typename
        successMsg
        code
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

  const last_updated = useRef<string>("")
  const joinError = useRef<boolean>(false)

  const joinCommunityMutation = useMutation({
    mutationFn: async ({ communityId }: UserJoinCommunityInput) => {
      return await graphQLClient.request(userJoinCommunityDocument, {
        input: { communityId },
      })
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [input.communityId] })

      const previousCommunity = queryClient.getQueryData<CommunityQuery>([
        input.communityId,
      ])

      queryClient.setQueryData<CommunityQuery>([input.communityId], (oldData) =>
        oldData
          ? {
              ...oldData,
              community: {
                ...community,
                memberCount: !oldData.community?.inCommunity
                  ? oldData.community!.memberCount + 1
                  : oldData.community!.memberCount - 1,
                inCommunity: !oldData.community?.inCommunity,
              },
            }
          : oldData
      )

      return { previousCommunity, updated_at: new Date().toISOString() }
    },
    onError: (_0, input, context) => {
      if (last_updated.current <= context!.updated_at) {
        queryClient.setQueryData(
          [input.communityId],
          context?.previousCommunity
        )
      } else {
        joinError.current = true
      }
    },
    onSettled: (_0, _1, input, context) => {
      if (last_updated.current <= context!.updated_at) {
        queryClient.invalidateQueries({ queryKey: [input.communityId] })

        if (joinError) {
          joinError.current = false
        }
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

        last_updated.current = new Date().toISOString()

        joinCommunityMutation.mutate({
          communityId: community.id,
        })
      }}
      disabled={joinError.current}
    >
      {!community.inCommunity ? "Join" : "Joined"}
    </button>
  )
}

export default JoinCommunityButton

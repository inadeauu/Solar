import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphql } from "../../graphql_codegen/gql"
import {
  CommunityQuery,
  UserJoinCommunityInput,
} from "../../graphql_codegen/graphql"
import { graphQLClient } from "../../utils/graphql"
import { useRef } from "react"
import { toast } from "react-toastify"
import type { Community } from "../../graphql/types"

const userJoinCommunityDocument = graphql(/* GraphQL */ `
  mutation UserJoinCommunity($input: UserJoinCommunityInput!) {
    userJoinCommunity(input: $input) {
      ... on UserJoinCommunitySuccess {
        __typename
        successMsg
        code
        community {
          id
          memberCount
          postCount
          inCommunity
          owner {
            id
            username
          }
          title
          created_at
          updated_at
        }
      }
    }
  }
`)

type CommunityJoinButtonProps = {
  community: Community
  className?: string
}

const CommunityJoinButton = ({
  community,
  className,
}: CommunityJoinButtonProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const rollback = useRef<CommunityQuery["community"] | null>(null)
  const error = useRef<boolean>(false)
  const sent_requests = useRef<number>(0)
  const last_updated = useRef<string>("")

  const joinCommunityMutation = useMutation({
    mutationFn: async ({ communityId }: UserJoinCommunityInput) => {
      return await graphQLClient.request(userJoinCommunityDocument, {
        input: { communityId },
      })
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [input.communityId] })

      const previous_community = queryClient.getQueryData<CommunityQuery>([
        input.communityId,
      ])

      queryClient.setQueryData<CommunityQuery>(
        ["community", input.communityId],
        (oldData) =>
          oldData
            ? {
                ...oldData,
                community: {
                  ...oldData.community!,
                  memberCount: !oldData.community!.inCommunity
                    ? oldData.community!.memberCount + 1
                    : oldData.community!.memberCount - 1,
                  inCommunity: !oldData.community!.inCommunity,
                },
              }
            : oldData
      )

      return { previous_community, updated_at: new Date().toISOString() }
    },
    onError: async (_0, input, context) => {
      if (!error.current) error.current = true

      if (last_updated.current <= context!.updated_at && !rollback.current) {
        queryClient.setQueryData(
          ["community", input.communityId],
          context!.previous_community
        )
      } else if (sent_requests.current == 1 && rollback.current) {
        queryClient.invalidateQueries([input.communityId])
      }
    },
    onSuccess: async (data, input, context) => {
      toast.success(data.userJoinCommunity.successMsg)
      rollback.current = data.userJoinCommunity.community

      if (last_updated.current <= context!.updated_at) {
        queryClient.invalidateQueries([input.communityId])
      } else if (sent_requests.current == 1 && error.current) {
        queryClient.invalidateQueries([input.communityId])
      }
    },
    onSettled: async () => {
      if (sent_requests.current == 1) {
        rollback.current = null
        error.current = false
      }

      sent_requests.current--
    },
  })

  return (
    <button
      className={`btn_blue ${className}`}
      onClick={() => {
        if (!user) {
          navigate("/login")
          return
        }

        last_updated.current = new Date().toISOString()
        sent_requests.current++

        joinCommunityMutation.mutate({
          communityId: community.id,
        })
      }}
    >
      {!community.inCommunity ? "Join" : "Joined"}
    </button>
  )
}

export default CommunityJoinButton

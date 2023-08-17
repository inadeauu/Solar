import { useNavigate } from "react-router-dom"
import { useAuth } from "../utils/useAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphql } from "../gql"
import { CommunityQuery, UserJoinCommunityInput } from "../gql/graphql"
import { graphQLClient } from "../utils/graphql"
import { useRef } from "react"
import { ClientError } from "graphql-request"
import { toast } from "react-toastify"

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

type JoinCommunityButtonProps = {
  community: NonNullable<CommunityQuery["community"]>
}

const JoinCommunityButton = ({ community }: JoinCommunityButtonProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const previous_success = useRef<CommunityQuery["community"]>(community)
  const request_returns = useRef<
    Array<NonNullable<CommunityQuery["community"]> | null>
  >([])
  const server_error = useRef<ClientError | null>(null)
  const sent_requests = useRef<number>(0)
  const last_success = useRef<number>(-1)
  const last_error = useRef<number>(-1)

  const joinCommunityMutation = useMutation({
    mutationFn: async ({ communityId }: UserJoinCommunityInput) => {
      return await graphQLClient.request(userJoinCommunityDocument, {
        input: { communityId },
      })
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [input.communityId] })

      queryClient.setQueryData<CommunityQuery>([input.communityId], (oldData) =>
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
    },
    onSettled: async (data, error, input) => {
      if (data?.userJoinCommunity.community) {
        request_returns.current.push(data.userJoinCommunity.community)
        last_success.current = request_returns.current.length
      } else {
        request_returns.current.push(null)
        last_error.current = request_returns.current.length
        if (error instanceof ClientError) {
          server_error.current = error
        }
      }

      console.log()

      if (
        sent_requests.current == 1 &&
        last_success.current == request_returns.current.length
      ) {
        queryClient.invalidateQueries({ queryKey: [input.communityId] })
      } else if (
        sent_requests.current == 1 &&
        last_error.current == request_returns.current.length &&
        last_success.current >= 0
      ) {
        queryClient.invalidateQueries({ queryKey: [input.communityId] })
      } else if (
        sent_requests.current == 1 &&
        last_error.current == request_returns.current.length &&
        last_success.current < 0
      ) {
        server_error.current?.response.errors?.forEach(({ message, path }) => {
          toast.error(message, { toastId: path?.toString() })
        })

        queryClient.setQueriesData([input.communityId], {
          community: previous_success.current,
        })
      }

      if (sent_requests.current == 1) {
        if (last_success.current >= 0) {
          previous_success.current =
            request_returns.current[last_success.current - 1]
        }

        request_returns.current = []
        server_error.current = null
        last_success.current = -1
        last_error.current = -1
      }

      sent_requests.current--
    },
  })

  return (
    <button
      className="btn_blue py-1 px-3"
      onClick={() => {
        if (!user) {
          navigate("/login")
          return
        }

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

export default JoinCommunityButton

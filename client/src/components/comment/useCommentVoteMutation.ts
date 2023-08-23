import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useRef } from "react"
import {
  CommentFeedQuery,
  VoteCommentInput,
  VoteStatus,
} from "../../graphql_codegen/graphql"
import { graphQLClient } from "../../utils/graphql"
import type { Comment } from "../../graphql/types"
import { graphql } from "../../graphql_codegen/gql"

type useCommentVoteMutationProps = {
  comment: Comment
  queryKey: any[]
}

const voteCommentDocument = graphql(/* GraphQL */ `
  mutation VoteComment($input: VoteCommentInput!) {
    voteComment(input: $input) {
      ... on VoteCommentSuccess {
        successMsg
        code
        comment {
          body
          created_at
          id
          owner {
            id
            username
          }
          voteSum
          voteStatus
          replyCount
        }
      }
    }
  }
`)

const useCommentVoteMutation = ({
  comment,
  queryKey,
}: useCommentVoteMutationProps) => {
  const queryClient = useQueryClient()

  const rollback = useRef<Comment | null>(null)
  const previous_comment = useRef<Comment>(comment)
  const error = useRef<boolean>(false)
  const sent_requests = useRef<number>(0)
  const last_updated = useRef<string>("")

  const newCommentFeed = (
    oldData: InfiniteData<CommentFeedQuery>,
    newComment: Comment | undefined
  ): InfiniteData<CommentFeedQuery> => {
    const newPages: CommentFeedQuery[] = oldData.pages.map((page) => {
      return {
        comments: {
          ...page.comments,
          edges: page.comments.edges.map((edge) => {
            if (newComment && edge.node.id == newComment.id) {
              return {
                node: newComment,
              }
            } else {
              return edge
            }
          }),
        },
      }
    })

    return {
      ...oldData,
      pages: newPages,
    }
  }

  const updateCommentFeed = (comment: Comment | undefined) => {
    queryClient.setQueryData<InfiniteData<CommentFeedQuery>>(
      queryKey,
      (oldData) => {
        if (!oldData) return oldData
        return newCommentFeed(oldData, comment)
      }
    )
  }

  const commentVoteMutation = useMutation({
    mutationFn: async ({ commentId, like }: VoteCommentInput) => {
      return await graphQLClient.request(voteCommentDocument, {
        input: { commentId, like },
      })
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey })

      const previous_comment_feed =
        queryClient.getQueryData<InfiniteData<CommentFeedQuery>>(queryKey)

      const previous_comment_query = previous_comment_feed?.pages.find((page) =>
        page.comments.edges.find((edge) => edge.node.id === input.commentId)
      )

      const previous_comment = previous_comment_query?.comments.edges.find(
        (edge) => edge.node.id == input.commentId
      )

      queryClient.setQueryData<InfiniteData<CommentFeedQuery>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData

          const newPages: CommentFeedQuery[] = oldData.pages.map((page) => {
            return {
              comments: {
                ...page.comments,
                edges: page.comments.edges.map((edge) => {
                  if (edge.node.id == input.commentId) {
                    return {
                      ...edge,
                      node: {
                        ...edge.node,
                        voteStatus:
                          (edge.node.voteStatus == VoteStatus.Like &&
                            input.like) ||
                          (edge.node.voteStatus == VoteStatus.Dislike &&
                            !input.like)
                            ? VoteStatus.None
                            : input.like
                            ? VoteStatus.Like
                            : VoteStatus.Dislike,
                      },
                    }
                  } else {
                    return edge
                  }
                }),
              },
            }
          })

          return {
            ...oldData,
            pages: newPages,
          }
        }
      )

      return {
        previous_comment: previous_comment?.node,
        updated_at: new Date().toISOString(),
      }
    },
    onError: async (_0, _1, context) => {
      if (!error.current) error.current = true

      if (last_updated.current <= context!.updated_at && !rollback.current) {
        updateCommentFeed(previous_comment.current)
      } else if (sent_requests.current == 1 && rollback.current) {
        updateCommentFeed(rollback.current)
      }
    },
    onSuccess: async (data, _0, context) => {
      rollback.current = data.voteComment.comment

      if (last_updated.current <= context!.updated_at) {
        updateCommentFeed(rollback.current)
      } else if (sent_requests.current == 1 && error.current) {
        updateCommentFeed(rollback.current)
      }
    },
    onSettled: async () => {
      if (sent_requests.current == 1) {
        if (rollback.current) {
          previous_comment.current = rollback.current
        }

        rollback.current = null
        error.current = false
      }

      sent_requests.current--
    },
  })

  return { mutate: commentVoteMutation.mutate, sent_requests, last_updated }
}

export default useCommentVoteMutation

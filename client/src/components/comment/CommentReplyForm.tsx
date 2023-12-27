import type { Comment } from "../../graphql/types"
import { useContext, useLayoutEffect, useRef, useState } from "react"
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentFeedQuery, CreateCommentReplyInput } from "../../graphql_codegen/graphql"
import { graphQLClient } from "../../utils/graphql"
import { toast } from "react-toastify"
import { graphql } from "../../graphql_codegen/gql"
import ErrorCard from "../misc/ErrorCard"
import { ImSpinner11 } from "react-icons/im"
import { CommentContext } from "../../contexts/CommentContext"

type CommentReplyFormProps = {
  comment: Comment
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  testid: string
}

const createCommentReplyDocument = graphql(/* GraphQL */ `
  mutation CreateCommentReply($input: CreateCommentReplyInput!) {
    createCommentReply(input: $input) {
      ... on CreateCommentReplySuccess {
        __typename
        successMsg
        code
      }
      ... on Error {
        __typename
        errorMsg
        code
      }
    }
  }
`)

const CommentReplyForm = ({ comment, setOpen, testid }: CommentReplyFormProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [error, setError] = useState<string>("")

  const [body, setBody] = useState<string>("")

  const queryClient = useQueryClient()

  const { commentOrderByType } = useContext(CommentContext)

  const createCommentReply = useMutation({
    mutationFn: async ({ body, commentId }: CreateCommentReplyInput) => {
      return await graphQLClient.request(createCommentReplyDocument, {
        input: { body, commentId },
      })
    },
    onSuccess: (data) => {
      if (data.createCommentReply.__typename == "CreateCommentReplySuccess") {
        toast.success(data.createCommentReply.successMsg)

        setBody("")

        setOpen(false)

        if (error) setError("")

        queryClient.setQueryData<InfiniteData<CommentFeedQuery>>(
          ["postCommentFeed", comment.post.id, commentOrderByType],
          (oldData) => {
            if (!oldData) return oldData

            const newPages: CommentFeedQuery[] = oldData.pages.map((page) => {
              return {
                comments: {
                  ...page.comments,
                  edges: page.comments.edges.map((edge) => {
                    if (edge.node.id == comment.id) {
                      return {
                        ...edge,
                        node: {
                          ...edge.node,
                          replyCount: edge.node.replyCount + 1,
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

        queryClient.resetQueries(["commentRepliesFeed", comment.id, commentOrderByType])
      } else if (data.createCommentReply.__typename == "CreateCommentReplyInputError") {
        setError(data.createCommentReply.errorMsg)
      }
    },
  })

  const updateTextAreaHeight = () => {
    if (!textAreaRef.current) return
    textAreaRef.current.style.height = "20px"
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
  }

  useLayoutEffect(() => {
    updateTextAreaHeight()
  }, [body])

  const submitCreateComment = () => {
    setSubmitting(true)

    if (!body) return

    createCommentReply.mutate({ body, commentId: comment.id })
  }

  return (
    <form data-testid={`${testid}-reply-form`} className="flex flex-col gap-2">
      {error && <ErrorCard error={error} className="mb-4" />}
      <textarea
        ref={textAreaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="text-sm min-h-[20px] h-auto w-full resize-none overflow-hidden p-2 rounded-lg border outline-none transition-colors duration-200 placeholder:font-light border-neutral-500 hover:border-blue-400 focus:border-blue-400"
        placeholder="Reply"
      />
      <div className="self-end flex gap-2 items-center">
        <span
          className={`text-xs font-semibold ${
            body.length > 2000 || body.trim().length <= 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {body.length}/2000
        </span>
        <button
          type="button"
          onClick={() => {
            submitCreateComment()
            setSubmitting(false)
          }}
          className="btn_blue text-xs px-2 py-1 self-end"
          disabled={body.trim().length <= 0 || body.length > 2000 || submitting}
        >
          {submitting ? <ImSpinner11 className="animate-spin h-5 w-5 mx-auto" /> : "Reply"}
        </button>
      </div>
    </form>
  )
}

export default CommentReplyForm

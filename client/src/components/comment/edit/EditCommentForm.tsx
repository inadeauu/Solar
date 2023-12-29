import { useLayoutEffect, useRef, useState } from "react"
import { Comment } from "../../../graphql/types"
import ErrorCard from "../../misc/ErrorCard"
import { ImSpinner11 } from "react-icons/im"
import ConfirmationModal from "../../misc/ConfirmationModal"
import { graphql } from "../../../graphql_codegen/gql"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteCommentInput, EditCommentInput, SingleCommentQuery } from "../../../graphql_codegen/graphql"
import { graphQLClient } from "../../../utils/graphql"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { translator } from "../../../utils/uuid"

const editCommentDocument = graphql(/* GraphQL */ `
  mutation EditComment($input: EditCommentInput!) {
    editComment(input: $input) {
      ... on EditCommentSuccess {
        __typename
        successMsg
        code
        comment {
          body
          created_at
          id
          post {
            id
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
      ... on Error {
        __typename
        errorMsg
        code
      }
    }
  }
`)

const deleteCommentDocument = graphql(/* GraphQL */ `
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      ... on DeleteCommentSuccess {
        __typename
        successMsg
        code
      }
    }
  }
`)

type EditCommentFormProps = {
  comment: Comment
}

const EditCommentForm = ({ comment }: EditCommentFormProps) => {
  const navigate = useNavigate()
  const [error, setError] = useState<string>("")
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [submittingEdit, setSubmittingEdit] = useState<boolean>(false)
  const [submittingDelete, setSubmittingDelete] = useState<boolean>(false)
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState<boolean>(false)

  const [body, setBody] = useState<string>(comment.body)

  const queryClient = useQueryClient()

  const editComment = useMutation({
    mutationFn: async ({ commentId, body }: EditCommentInput) => {
      return await graphQLClient.request(editCommentDocument, {
        input: { commentId, body },
      })
    },
    onSuccess: (data) => {
      if (data.editComment.__typename == "EditCommentSuccess") {
        const updatedComment = data.editComment.comment
        queryClient.setQueryData<SingleCommentQuery>(["comment", updatedComment.id], (oldData) => {
          return oldData
            ? {
                ...oldData,
                comment: updatedComment,
              }
            : oldData
        })

        toast.success("Successfully edited comment")

        navigate(`/posts/${translator.fromUUID(comment.post.id)}`)
      } else if (data.editComment.__typename == "EditCommentInputError") {
        setError(data.editComment.errorMsg)
      }
    },
  })

  const deleteComment = useMutation({
    mutationFn: async ({ commentId }: DeleteCommentInput) => {
      return await graphQLClient.request(deleteCommentDocument, {
        input: { commentId },
      })
    },
    onSuccess: (data) => {
      toast.success("Successfully deleted comment")
      navigate("/")
    },
  })

  const submitEditComment = () => {
    setSubmittingEdit(true)

    if (!body) return

    editComment.mutate({ commentId: comment.id, body })
  }

  const submitDeleteComment = () => {
    setSubmittingDelete(true)
    deleteComment.mutate({ commentId: comment.id })
  }

  const updateTextAreaHeight = () => {
    if (!textAreaRef.current) return
    textAreaRef.current.style.height = "100px"
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
  }

  useLayoutEffect(() => {
    updateTextAreaHeight()
  }, [body])

  return (
    <>
      <div className="bg-white border border-neutral-300 rounded-lg p-4">
        <form className="flex flex-col gap-3">
          <div className="flex gap-2 justify-between items-center">
            <h1 className="text-xl font-medium mb-1">Update Comment</h1>
            <button
              data-testid="reset-changes-button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()

                setBody(comment.body)
              }}
              className="btn_blue py-[2px] px-3 text-sm"
              disabled={body == comment.body}
            >
              Reset Changes
            </button>
          </div>
          {error && <ErrorCard data-testid="edit-comment-error" error={error} className="mb-4" />}
          <div className="flex flex-col gap-1">
            <textarea
              data-testid="comment-body-input"
              ref={textAreaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[100px] h-auto w-full resize-none overflow-hidden p-2 rounded-lg border outline-none transition-colors duration-200 placeholder:font-light border-neutral-500 hover:border-blue-400 focus:border-blue-400"
              placeholder="Comment"
            />
            <span
              data-testid="body-input-indicator"
              className={`text-xs font-semibold self-end ${
                body.length > 2000 || body.trim().length <= 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {body.length}/2000
            </span>
          </div>
          <div className="flex gap-4 self-end">
            <button
              data-testid="comment-delete-button"
              type="button"
              onClick={() => {
                setDeleteCommentModalOpen(true)
              }}
              className="btn_red px-3 py-1"
              disabled={submittingDelete}
            >
              Delete
            </button>
            <button
              data-testid="comment-edit-button"
              type="button"
              onClick={() => {
                submitEditComment()
                setSubmittingEdit(false)
              }}
              className="btn_blue px-3 py-1 self-end"
              disabled={body.trim().length <= 0 || body.length > 2000 || submittingEdit || body == comment.body}
            >
              {submittingEdit ? <ImSpinner11 className="animate-spin h-5 w-5 mx-auto" /> : "Update"}
            </button>
          </div>
        </form>
      </div>
      <ConfirmationModal
        testid="delete-modal"
        isOpen={deleteCommentModalOpen}
        onClose={() => setDeleteCommentModalOpen(false)}
        text="Are you sure you want to delete this comment?"
        onAccept={() => {
          submitDeleteComment()
          setSubmittingDelete(false)
        }}
      />
    </>
  )
}

export default EditCommentForm

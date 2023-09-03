import { useLayoutEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ImSpinner11 } from "react-icons/im"
import ErrorCard from "../../misc/ErrorCard"
import type { Post } from "../../../graphql/types"
import { graphql } from "../../../graphql_codegen/gql"
import {
  DeletePostInput,
  EditPostInput,
  SinglePostQuery,
} from "../../../graphql_codegen/graphql"
import { graphQLClient } from "../../../utils/graphql"
import { toast } from "react-toastify"
import ConfirmationModal from "../../misc/ConfirmationModal"

const editPostDocument = graphql(/* GraphQL */ `
  mutation EditPost($input: EditPostInput!) {
    editPost(input: $input) {
      ... on EditPostSuccess {
        __typename
        successMsg
        code
        post {
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
      ... on Error {
        __typename
        errorMsg
        code
      }
    }
  }
`)

const deletePostDocument = graphql(/* GraphQL */ `
  mutation DeletePost($input: DeletePostInput!) {
    deletePost(input: $input) {
      ... on DeletePostSuccess {
        __typename
        successMsg
        code
      }
    }
  }
`)

type EditPostFormProps = {
  post: Post
}

const EditPostForm = ({ post }: EditPostFormProps) => {
  const navigate = useNavigate()
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [submittingEdit, setSubmittingEdit] = useState<boolean>(false)
  const [submittingDelete, setSubmittingDelete] = useState<boolean>(false)

  const [error, setError] = useState<string>("")

  const [deletePostModalOpen, setDeletePostModalOpen] = useState<boolean>(false)

  const [title, setTitle] = useState<string>(post.title)
  const [body, setBody] = useState<string>(post.body)

  const queryClient = useQueryClient()

  const editPost = useMutation({
    mutationFn: async ({ postId, title, body }: EditPostInput) => {
      return await graphQLClient.request(editPostDocument, {
        input: { postId, body, title },
      })
    },
    onSuccess: (data) => {
      if (data.editPost.__typename == "EditPostSuccess") {
        const updatedPost = data.editPost.post
        queryClient.setQueryData<SinglePostQuery>(
          ["post", updatedPost.id],
          (oldData) => {
            return oldData
              ? {
                  ...oldData,
                  post: updatedPost,
                }
              : oldData
          }
        )
        setTitle("")
        setBody("")
        if (error) setError("")
        toast.success("Successfully edited post")
        navigate(-1)
      } else if (data.editPost.__typename == "EditPostInputError") {
        setError(data.editPost.errorMsg)
      }
    },
  })

  const deletePost = useMutation({
    mutationFn: async ({ postId }: DeletePostInput) => {
      return await graphQLClient.request(deletePostDocument, {
        input: { postId },
      })
    },
    onSuccess: (data) => {
      if (data.deletePost.__typename == "DeletePostSuccess") {
        setTitle("")
        setBody("")
        if (error) setError("")
        toast.success("Successfully deleted post")
        navigate("/")
      }
    },
  })

  const submitEditPost = () => {
    setSubmittingEdit(true)

    if (!title) return

    editPost.mutate({ postId: post.id, title, body })
  }

  const submitDeletePost = () => {
    setSubmittingDelete(true)
    deletePost.mutate({ postId: post.id })
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
        <div className="flex flex-col gap-4">
          <form className="flex flex-col gap-3">
            <div className="flex gap-2 justify-between items-center">
              <h1 className="text-xl font-medium mb-1">Update Post</h1>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  setTitle(post.title)
                  setBody(post.body)
                }}
                className="btn_blue py-[2px] px-3 text-sm"
                disabled={title == post.title && body == post.body}
              >
                Reset Changes
              </button>
            </div>
            {error && <ErrorCard error={error} className="mb-4" />}
            <div className="flex flex-col gap-1">
              <input
                name="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg border w-full px-2 py-1 outline-none transition-all duration-200 placeholder:font-light border-neutral-500 hover:border-blue-400 focus:border-blue-400"
              />
              <span
                className={`text-xs font-semibold self-end
                  ${
                    title.trim().length <= 0 || title.length > 200
                      ? "text-red-500"
                      : "text-green-500"
                  }
                `}
              >
                {title.length}/200
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <textarea
                ref={textAreaRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[100px] h-auto w-full resize-none overflow-hidden p-2 rounded-lg border outline-none transition-colors duration-200 placeholder:font-light border-neutral-500 hover:border-blue-400 focus:border-blue-400"
                placeholder="Body (optional)"
              />
              <span
                className={`text-xs font-semibold self-end ${
                  body.length > 20000 && "text-red-500"
                }`}
              >
                {body.length}/20000
              </span>
            </div>
            <div className="flex gap-4 self-end">
              <button
                type="button"
                onClick={() => {
                  setDeletePostModalOpen(true)
                }}
                className="btn_red px-3 py-1"
                disabled={submittingDelete}
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => {
                  submitEditPost()
                  setSubmittingEdit(false)
                }}
                className="btn_blue px-3 py-1"
                disabled={
                  title.trim().length <= 0 ||
                  title.length > 200 ||
                  body.length > 20000 ||
                  (title == post.title && body == post.body) ||
                  submittingEdit
                }
              >
                {submittingEdit ? (
                  <ImSpinner11 className="animate-spin h-5 w-5 mx-auto" />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmationModal
        isOpen={deletePostModalOpen}
        onClose={() => setDeletePostModalOpen(false)}
        text="Are you sure you want to delete this post?"
        onAccept={() => {
          submitDeletePost()
          setSubmittingDelete(false)
        }}
      />
    </>
  )
}

export default EditPostForm

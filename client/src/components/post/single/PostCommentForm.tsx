import { useLayoutEffect, useRef, useState } from "react"
import type { Post } from "../../../graphql/types"
import { useMutation } from "@tanstack/react-query"
import { graphQLClient } from "../../../utils/graphql"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"
import { graphql } from "../../../graphql_codegen"
import { CreateCommentInput } from "../../../graphql_codegen/graphql"
import { ImSpinner11 } from "react-icons/im"
import ErrorCard from "../../misc/ErrorCard"
import { toast } from "react-toastify"

type PostCommentFormProps = {
  post: Post
}

const createCommentDocument = graphql(/* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      ... on CreateCommentSuccess {
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

const PostCommentForm = ({ post }: PostCommentFormProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [error, setError] = useState<string>("")

  const [openEditor, setOpenEditor] = useState<boolean>(false)
  const [body, setBody] = useState<string>("")

  const createComment = useMutation({
    mutationFn: async ({ body, postId }: CreateCommentInput) => {
      return await graphQLClient.request(createCommentDocument, {
        input: { body, postId },
      })
    },
    onSuccess: (data) => {
      if (data.createComment.__typename == "CreateCommentSuccess") {
        toast.success(data.createComment.successMsg)

        setBody("")

        if (error) setError("")

        setOpenEditor(false)
      } else if (data.createComment.__typename == "CreateCommentInputError") {
        setError(data.createComment.errorMsg)
      }
    },
  })

  const updateTextAreaHeight = () => {
    if (!textAreaRef.current) return
    textAreaRef.current.style.height = "100px"
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
  }

  useLayoutEffect(() => {
    updateTextAreaHeight()
  }, [body])

  const submitCreateComment = () => {
    setSubmitting(true)

    if (!body) return

    createComment.mutate({ body, postId: post.id })
  }

  return (
    <div className="bg-white border border-neutral-300 rounded-lg p-4">
      {!openEditor ? (
        <button
          onClick={() => {
            if (!user) {
              navigate("/login")
              return
            }

            setOpenEditor((prev) => !prev)
          }}
          className="btn_blue py-1 px-3 text-sm"
        >
          Create Comment
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              setOpenEditor((prev) => !prev)
            }}
            className="btn_red py-1 px-3 text-sm self-start"
          >
            Close
          </button>
          <form className="flex flex-col gap-3">
            {error && <ErrorCard error={error} className="mb-4" />}
            <div className="flex flex-col gap-1">
              <textarea
                ref={textAreaRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[100px] h-auto w-full resize-none overflow-hidden p-2 rounded-lg border outline-none transition-colors duration-200 placeholder:font-light border-neutral-500 hover:border-blue-400 focus:border-blue-400"
                placeholder="Comment"
              />
              <span
                className={`text-xs font-semibold self-end ${
                  body.length > 2000 || body.trim().length <= 0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {body.length}/2000
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                submitCreateComment()
                setSubmitting(false)
              }}
              className="btn_blue px-3 py-1 self-end"
              disabled={
                body.trim().length <= 0 || body.length > 2000 || submitting
              }
            >
              {submitting ? (
                <ImSpinner11 className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Comment"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default PostCommentForm

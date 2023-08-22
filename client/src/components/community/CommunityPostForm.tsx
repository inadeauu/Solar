import { useLayoutEffect, useRef, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { CommunityQuery, CreatePostInput } from "../../graphql_codegen/graphql"
import { graphql } from "../../graphql_codegen/gql"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphQLClient } from "../../utils/graphql"
import { ImSpinner11 } from "react-icons/im"
import ErrorCard from "../misc/ErrorCard"
import type { Community } from "../../graphql/types"

type CommunityPostFormProps = {
  community: Community
}

const createCommunityPostDocument = graphql(/* GraphQL */ `
  mutation CreateCommunityPost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on CreatePostSuccess {
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

const CommunityPostForm = ({ community }: CommunityPostFormProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [error, setError] = useState<string>("")

  const [openEditor, setOpenEditor] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [body, setBody] = useState<string>("")

  const queryClient = useQueryClient()

  const createCommunity = useMutation({
    mutationFn: async ({ title, body, communityId }: CreatePostInput) => {
      return await graphQLClient.request(createCommunityPostDocument, {
        input: { title, body, communityId },
      })
    },
    onSuccess: (data) => {
      if (data.createPost.__typename == "CreatePostSuccess") {
        queryClient.setQueryData<CommunityQuery>([community.id], (oldData) =>
          oldData
            ? {
                ...oldData,
                community: {
                  ...community,
                  postCount: community.postCount + 1,
                },
              }
            : oldData
        )

        setTitle("")

        if (body) {
          setBody("")
        }

        if (error) setError("")

        setOpenEditor(false)
      } else if (data.createPost.__typename == "CreatePostInputError") {
        setError(data.createPost.errorMsg)
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

  const submitCreatePost = () => {
    setSubmitting(true)

    if (!title) return

    createCommunity.mutate({ title, body, communityId: community.id })
  }

  return (
    <div className="bg-white border border-neutral-300 rounded-lg p-4">
      {!openEditor ? (
        <button
          onClick={() => {
            if (!user) {
              navigate("/login")
            }
            setOpenEditor((prev) => !prev)
          }}
          className="btn_blue py-1 px-3 text-sm"
        >
          Create Post
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
            <button
              type="button"
              onClick={() => {
                submitCreatePost()
                setSubmitting(false)
              }}
              className="btn_blue px-3 py-1 self-end"
              disabled={
                title.trim().length <= 0 ||
                title.length > 200 ||
                body.length > 20000 ||
                submitting
              }
            >
              {submitting ? (
                <ImSpinner11 className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Post"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default CommunityPostForm

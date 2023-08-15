import { useLayoutEffect, useRef, useState } from "react"
import { useAuth } from "../utils/useAuth"
import { useNavigate } from "react-router-dom"
import { CommunityQuery, CreatePostInput } from "../gql/graphql"
import { graphql } from "../gql"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import ErrorCard from "./ErrorCard"
import { ImSpinner11 } from "react-icons/im"

type CommunityCreatePostProps = {
  community: NonNullable<CommunityQuery["community"]>
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
      ... on CreatePostInputError {
        inputErrors {
          body
          communityId
          title
        }
      }
    }
  }
`)

const CommunityCreatePost = ({ community }: CommunityCreatePostProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [error, setError] = useState<string>("")
  const [submitting, setSubmitting] = useState<boolean>(false)

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
      if (
        data.createPost.__typename == "CreatePostInputError" ||
        data.createPost.__typename == "AuthenticationError"
      ) {
        setError(data.createPost.errorMsg)
      } else if (data.createPost.__typename == "CreatePostSuccess") {
        if (error) {
          setError("")
        }

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

        setOpenEditor(false)
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
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
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
              if (error) {
                setError("")
              }
              setOpenEditor((prev) => !prev)
            }}
            className="btn_red py-1 px-3 text-sm self-start"
          >
            Close
          </button>
          {error && (
            <ErrorCard className="w-fit self-center px-6" error={error} />
          )}
          <form className="flex flex-col gap-3">
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

export default CommunityCreatePost

import { useRef } from "react"
import { Post } from "../../../graphql/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { votePostDocument } from "../../../graphql/sharedDocuments"
import {
  PostVoteStatus,
  SinglePostQuery,
  VotePostInput,
} from "../../../graphql_codegen/graphql"
import { graphQLClient } from "../../../utils/graphql"
import { useAuth } from "../../../utils/useAuth"
import { redirect } from "react-router-dom"
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi"

type PostSidebarProps = {
  post: Post
}

const PostSidebar = ({ post }: PostSidebarProps) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const rollback = useRef<Post | null>(null)
  const previous_post = useRef<Post>(post)
  const error = useRef<boolean>(false)
  const sent_requests = useRef<number>(0)
  const last_updated = useRef<string>("")

  const postVoteMutation = useMutation({
    mutationFn: async ({ postId, like }: VotePostInput) => {
      return await graphQLClient.request(votePostDocument, {
        input: { postId, like },
      })
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries([post.id])

      const previous_post = queryClient.getQueryData<SinglePostQuery>([post.id])

      queryClient.setQueryData<SinglePostQuery>([post.id], (oldData) =>
        oldData
          ? {
              ...oldData,
              post: {
                ...post,
                voteStatus:
                  (oldData.post!.voteStatus == PostVoteStatus.Like &&
                    input.like) ||
                  (oldData.post!.voteStatus == PostVoteStatus.Dislike &&
                    !input.like)
                    ? PostVoteStatus.None
                    : input.like
                    ? PostVoteStatus.Like
                    : PostVoteStatus.Dislike,
              },
            }
          : oldData
      )

      return {
        previous_post,
        updated_at: new Date().toISOString(),
      }
    },
    onError: async (_0, _1, context) => {
      if (!error.current) error.current = true

      if (last_updated.current <= context!.updated_at && !rollback.current) {
        queryClient.setQueryData<SinglePostQuery>([post.id], {
          post: previous_post.current,
        })
      } else if (sent_requests.current == 1 && rollback.current) {
        queryClient.setQueryData<SinglePostQuery>([post.id], {
          post: rollback.current,
        })
      }
    },
    onSuccess: async (data, _0, context) => {
      rollback.current = data.votePost.post

      if (last_updated.current <= context!.updated_at) {
        queryClient.setQueryData<SinglePostQuery>([post.id], {
          post: rollback.current,
        })
      } else if (sent_requests.current == 1 && error.current) {
        queryClient.setQueryData<SinglePostQuery>([post.id], {
          post: rollback.current,
        })
      }
    },
    onSettled: async () => {
      if (sent_requests.current == 1) {
        if (rollback.current) {
          previous_post.current = rollback.current
        }

        rollback.current = null
        error.current = false
      }

      sent_requests.current--
    },
  })

  const vote = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    like: boolean
  ) => {
    if (!user) return redirect("/login")

    e.preventDefault()
    e.stopPropagation()
    last_updated.current = new Date().toISOString()
    sent_requests.current++
    postVoteMutation.mutate({ postId: post.id, like })
  }

  return (
    <div className="flex flex-col items-center gap-1 bg-neutral-200 rounded-full">
      <div
        onClick={(e) => vote(e, true)}
        className="group/upvote rounded-full p-[6px] hover:bg-neutral-300"
      >
        {post.voteStatus == PostVoteStatus.Like ? (
          <BiSolidUpvote className="w-[18px] h-[18px] text-green-500" />
        ) : (
          <>
            <BiUpvote className="w-[18px] h-[18px] group-hover/upvote:hidden" />
            <BiSolidUpvote className="w-[18px] h-[18px] hidden group-hover/upvote:block text-green-500" />
          </>
        )}
      </div>
      <span className="text-sm">{post.voteSum}</span>
      <div
        onClick={(e) => vote(e, false)}
        className="group/upvote rounded-full p-[6px] hover:bg-neutral-300"
      >
        {post.voteStatus == PostVoteStatus.Dislike ? (
          <BiSolidDownvote className="w-[18px] h-[18px] text-red-500" />
        ) : (
          <>
            <BiDownvote className="w-[18px] h-[18px] group-hover/upvote:hidden" />
            <BiSolidDownvote className="w-[18px] h-[18px] hidden group-hover/upvote:block text-red-500" />
          </>
        )}
      </div>
    </div>
  )
}

export default PostSidebar

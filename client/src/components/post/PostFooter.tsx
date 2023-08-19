import {
  BiComment,
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi"
import { Flatten } from "../../types/shared"
import { PostFeedQuery, PostVoteStatus, VotePostInput } from "../../gql/graphql"
import { useRef } from "react"
import { graphql } from "../../gql"
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { graphQLClient } from "../../utils/graphql"

type PostFooterProps = {
  post: Flatten<PostFeedQuery["posts"]["edges"]>["node"]
  queryKey: any[]
}

const votePostDocument = graphql(/* GraphQL */ `
  mutation VotePost($input: VotePostInput!) {
    votePost(input: $input) {
      ... on VotePostSuccess {
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
    }
  }
`)

const newPostFeed = (
  oldData: InfiniteData<PostFeedQuery>,
  newPost: Flatten<PostFeedQuery["posts"]["edges"]>["node"] | undefined
): InfiniteData<PostFeedQuery> => {
  const newPages: PostFeedQuery[] = oldData.pages.map((page) => {
    return {
      posts: {
        ...page.posts,
        edges: page.posts.edges.map((edge) => {
          if (newPost && edge.node.id == newPost.id) {
            return {
              node: newPost,
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

const PostFooter = ({ post, queryKey }: PostFooterProps) => {
  const queryClient = useQueryClient()

  const rollback = useRef<
    Flatten<PostFeedQuery["posts"]["edges"]>["node"] | null
  >(null)
  const error = useRef<boolean>(false)
  const sent_requests = useRef<number>(0)
  const last_updated = useRef<string>("")

  const updatePostFeed = (
    post: Flatten<PostFeedQuery["posts"]["edges"]>["node"] | undefined
  ) => {
    queryClient.setQueryData<InfiniteData<PostFeedQuery>>(
      queryKey,
      (oldData) => {
        if (!oldData) return oldData
        return newPostFeed(oldData, post)
      }
    )
  }

  const postVoteMutation = useMutation({
    mutationFn: async ({ postId, like }: VotePostInput) => {
      return await graphQLClient.request(votePostDocument, {
        input: { postId, like },
      })
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey })

      const previous_post_feed =
        queryClient.getQueryData<InfiniteData<PostFeedQuery>>(queryKey)

      const previous_post_query = previous_post_feed?.pages.find((page) =>
        page.posts.edges.find((edge) => edge.node.id === input.postId)
      )

      const previous_post = previous_post_query?.posts.edges.find(
        (edge) => edge.node.id == input.postId
      )

      queryClient.setQueryData<InfiniteData<PostFeedQuery>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData

          const newPages: PostFeedQuery[] = oldData.pages.map((page) => {
            return {
              posts: {
                ...page.posts,
                edges: page.posts.edges.map((edge) => {
                  if (edge.node.id == input.postId) {
                    return {
                      ...edge,
                      node: {
                        ...edge.node,
                        voteStatus:
                          (edge.node.voteStatus == PostVoteStatus.Like &&
                            input.like) ||
                          (edge.node.voteStatus == PostVoteStatus.Dislike &&
                            !input.like)
                            ? PostVoteStatus.None
                            : input.like
                            ? PostVoteStatus.Like
                            : PostVoteStatus.Dislike,
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
        previous_post: previous_post?.node,
        updated_at: new Date().toISOString(),
      }
    },
    onError: async (_0, _1, context) => {
      if (!error.current) error.current = true

      if (last_updated.current <= context!.updated_at && !rollback.current) {
        updatePostFeed(context?.previous_post)
      } else if (sent_requests.current == 1 && rollback.current) {
        updatePostFeed(rollback.current)
      }
    },
    onSuccess: async (data, _0, context) => {
      rollback.current = data.votePost.post

      if (last_updated.current <= context!.updated_at) {
        updatePostFeed(rollback.current)
      } else if (sent_requests.current == 1 && error.current) {
        updatePostFeed(rollback.current)
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
    <div className="flex mt-4 gap-4">
      <div className="flex items-center gap-1 bg-neutral-200 rounded-full">
        <div className="group/upvote rounded-full p-[6px] hover:bg-neutral-300">
          {post.voteStatus == PostVoteStatus.Like ? (
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                postVoteMutation.mutate({ postId: post.id, like: true })
              }}
            >
              <BiSolidUpvote className="w-[18px] h-[18px] text-green-500" />
            </div>
          ) : (
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                postVoteMutation.mutate({ postId: post.id, like: true })
              }}
            >
              <BiUpvote className="w-[18px] h-[18px] group-hover/upvote:hidden" />
              <BiSolidUpvote className="w-[18px] h-[18px] hidden group-hover/upvote:block text-green-500" />
            </div>
          )}
        </div>
        <span className="text-sm">{post.voteSum}</span>
        <div className="group/upvote rounded-full p-[6px] hover:bg-neutral-300">
          {post.voteStatus == PostVoteStatus.Dislike ? (
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                postVoteMutation.mutate({ postId: post.id, like: false })
              }}
            >
              <BiSolidDownvote className="w-[18px] h-[18px] text-red-500" />
            </div>
          ) : (
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                postVoteMutation.mutate({ postId: post.id, like: false })
              }}
            >
              <BiDownvote className="w-[18px] h-[18px] group-hover/upvote:hidden" />
              <BiSolidDownvote className="w-[18px] h-[18px] hidden group-hover/upvote:block text-red-500" />
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center bg-neutral-200 rounded-full px-3 py-[6px] hover:bg-neutral-300">
        <BiComment className="w-[18px] h-[18px]" />
        <span className="text-sm">{post.commentCount}</span>
      </div>
    </div>
  )
}

export default PostFooter

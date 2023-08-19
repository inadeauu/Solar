import { Link } from "react-router-dom"
import { PostFeedQuery } from "../../gql/graphql"
import moment from "moment"
import { useLayoutEffect, useRef, useState } from "react"
import PostFooter from "./PostFooter"
import { Flatten } from "../../types/shared"

type PostProps = {
  post: Flatten<PostFeedQuery["posts"]["edges"]>["node"]
  innerRef?: React.Ref<HTMLAnchorElement> | undefined
  queryKey: any[]
}

const Post = ({ post, innerRef, queryKey }: PostProps) => {
  const [overflown, setOverflown] = useState<boolean>(false)
  const bodyRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!bodyRef.current) return
    if (bodyRef.current.scrollHeight > bodyRef.current.clientHeight) {
      setOverflown(true)
    }
  }, [])

  return (
    <Link
      ref={innerRef}
      to="#"
      className="bg-white border border-neutral-300 rounded-lg p-4 hover:bg-neutral-100 hover:cursor-pointer group"
    >
      <div className="flex flex-col gap-[6px]">
        <span className="text-neutral-500 text-xs">
          Posted by{" "}
          <Link
            to="#"
            className="text-black font-medium hover:underline hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {post.owner.username}
          </Link>
          {" • "}
          {moment(post.created_at).fromNow()}
        </span>
        <span className="font-semibold text-lg">{post.title}</span>
        {post.body && (
          <div ref={bodyRef} className="max-h-[250px] overflow-hidden">
            <p className="text-sm font-light text-neutral-800">{post.body}</p>
          </div>
        )}
        {overflown && (
          <span className="text-sm text-blue-400 group-visited:text-violet-400">
            Read More
          </span>
        )}
      </div>
      <PostFooter post={post} queryKey={queryKey} />
    </Link>
  )
}

export default Post

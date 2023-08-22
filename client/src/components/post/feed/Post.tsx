import { Link } from "react-router-dom"
import moment from "moment"
import { Ref, useLayoutEffect, useRef, useState } from "react"
import PostFooter from "./PostFooter"
import type { Post } from "../../../graphql/types"
import { translator } from "../../../utils/uuid"

type PostProps = {
  post: Post
  innerRef?: Ref<HTMLAnchorElement> | undefined
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
      to={`/posts/${post.title}/${translator.fromUUID(post.id)}`}
      className="bg-white border border-neutral-300 rounded-lg p-4 hover:cursor-pointer hover:border-black group"
    >
      <div className="flex flex-col gap-[6px]">
        <span className="text-neutral-500 text-xs">
          Posted by{" "}
          <span
            className="text-black font-medium hover:underline hover:cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            {post.owner.username}
          </span>
          {" • "}
          {moment(post.created_at).fromNow()}
        </span>
        <span className="font-semibold text-lg">{post.title}</span>
        {post.body && (
          <div ref={bodyRef} className="line-clamp-[12]">
            <p className="text-sm font-light text-neutral-800">{post.body}</p>
          </div>
        )}
        {overflown && (
          <span className="text-sm text-blue-400 group-visited:text-violet-400">
            See Full Post
          </span>
        )}
      </div>
      <PostFooter post={post} queryKey={queryKey} />
    </Link>
  )
}

export default Post

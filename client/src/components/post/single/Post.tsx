import { Link } from "react-router-dom"
import type { Post } from "../../../graphql/types"
import moment from "moment"
import { useLayoutEffect, useRef, useState } from "react"
import PostSidebar from "./PostSidebar"

type PostProps = {
  post: Post
}

const Post = ({ post }: PostProps) => {
  const [overflown, setOverflown] = useState<boolean>(false)
  const bodyRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!bodyRef.current) return
    if (bodyRef.current.scrollHeight > bodyRef.current.clientHeight) {
      setOverflown(true)
    }
  }, [])

  return (
    <div className="flex gap-4 bg-white border border-neutral-300 rounded-lg p-4 hover:bg-neutral-100">
      <PostSidebar post={post} />
      <div className="flex flex-col gap-[6px] break-words min-w-0">
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
        {overflown && <span className="text-sm text-blue-400">Show More</span>}
      </div>
    </div>
  )
}

export default Post

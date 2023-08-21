import { Link, useNavigate } from "react-router-dom"
import moment from "moment"
import { useLayoutEffect, useRef, useState } from "react"
import PostFooter from "./PostFooter"
import type { Post } from "../../../graphql/types"
import { translator } from "../../../utils/uuid"

type PostProps = {
  post: Post
  innerRef?: React.LegacyRef<HTMLDivElement> | undefined
  queryKey: any[]
}

const Post = ({ post, innerRef, queryKey }: PostProps) => {
  const [overflown, setOverflown] = useState<boolean>(false)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (!bodyRef.current) return
    if (bodyRef.current.scrollHeight > bodyRef.current.clientHeight) {
      setOverflown(true)
    }
  }, [])

  return (
    <div
      ref={innerRef}
      className="bg-white border border-neutral-300 rounded-lg p-4 hover:bg-neutral-100 hover:cursor-pointer group"
      onClick={() => {
        navigate(`/posts/${post.title}/${translator.fromUUID(post.id)}`)
      }}
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
    </div>
  )
}

export default Post

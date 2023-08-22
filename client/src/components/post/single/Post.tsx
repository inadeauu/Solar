import type { Post } from "../../../graphql/types"
import moment from "moment"
import { useLayoutEffect, useRef, useState } from "react"
import PostSidebar from "./PostSidebar"
import { IoIosArrowDown } from "react-icons/io"

type PostProps = {
  post: Post
}

const Post = ({ post }: PostProps) => {
  const [overflown, setOverflown] = useState<boolean>(true)
  const bodyRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!post.body) {
      setOverflown(false)
    }

    if (!bodyRef.current) return
    if (bodyRef.current.scrollHeight <= bodyRef.current.clientHeight) {
      setOverflown(false)
    }
  }, [post.body])

  return (
    <div className="bg-white border border-neutral-300 rounded-lg">
      <div className="flex">
        <span className="bg-neutral-50 p-1 rounded-l-lg">
          <PostSidebar post={post} />
        </span>
        <div className="flex flex-col gap-[6px] break-words min-w-0 px-4 py-2">
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
            <div
              ref={bodyRef}
              className={
                overflown ? "max-h-[500px] overflow-hidden" : "max-h-fit"
              }
            >
              <p className="text-sm font-light text-neutral-800">{post.body}</p>
            </div>
          )}
          {overflown && (
            <span
              className="w-fit text-sm text-blue-400 hover:cursor-pointer flex gap-1 items-center active:bg-neutral-100 p-1"
              onClick={() => setOverflown(false)}
            >
              Show More <IoIosArrowDown />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Post

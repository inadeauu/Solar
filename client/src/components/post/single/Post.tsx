import type { Post } from "../../../graphql/types"
import moment from "moment"
import { useLayoutEffect, useRef, useState } from "react"
import PostSidebar from "./PostSidebar"
import { IoIosArrowDown } from "react-icons/io"
import { BiComment } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import { translator } from "../../../utils/uuid"
import { useAuth } from "../../../hooks/useAuth"

type PostProps = {
  post: Post
}

const Post = ({ post }: PostProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
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
        <div className="flex flex-col gap-[6px] break-words min-w-0 w-full px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-xs flex flex-col gap-[1px]">
              <div>
                Posted in{" "}
                <span
                  className="text-black font-medium hover:underline hover:cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate(
                      `/communities/${translator.fromUUID(post.community.id)}`
                    )
                  }}
                >
                  {post.community.title}
                </span>
                {" • "}
                {moment(post.created_at).fromNow()}
              </div>
              <div>
                Posted by{" "}
                <span
                  className="text-black font-medium hover:underline hover:cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate(`/profile/${post.owner.username}`)
                  }}
                >
                  {post.owner.username}
                </span>
              </div>
            </span>
            {user?.id == post.owner.id && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  navigate(`/posts/${translator.fromUUID(post.id)}/edit`)
                }}
                className="btn_blue text-sm py-[2px] px-3"
              >
                Edit
              </button>
            )}
          </div>
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
          <div className="flex gap-2 items-center w-fit mt-1">
            <BiComment className="w-[16px] h-[16px] mt-[1px]" />
            <span className="text-sm">{post.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post

// import { useInfiniteQuery } from "@tanstack/react-query"
// import { useInView } from "react-intersection-observer"
// import { api } from "../utils/axios"
// import { useEffect, useState } from "react"
// import { ImSpinner11 } from "react-icons/im"
// import { AxiosError } from "axios"
// import type { PostPage, ErrorResponse } from "../types/api"
// import Dropdown from "./Dropdown"

const PostFeed = () => {
  // const { ref, inView } = useInView()
  // const [sort, setSort] = useState<string>("Recent")

  // const { status, data, error, isFetchingNextPage, fetchNextPage } =
  //   useInfiniteQuery<PostPage, AxiosError<ErrorResponse>>(
  //     ["posts-home"],
  //     async ({ pageParam = undefined }) => {
  //       const res = await api.get("/post", {
  //         params: { cursor: pageParam },
  //       })
  //       return res.data
  //     },
  //     {
  //       getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
  //     }
  //   )

  // useEffect(() => {
  //   if (inView) {
  //     fetchNextPage()
  //   }
  // }, [inView, fetchNextPage])

  // return status === "loading" ? (
  //   <ImSpinner11 className="h-10 w-10 animate-spin" />
  // ) : status === "error" ? (
  //   <p>Error: {error.response?.data.error.message}</p>
  // ) : (
  //   <div className="w-3/4 flex flex-col gap-1">
  //     <Dropdown
  //       width="w-[90px]"
  //       items={["Recent", "Best", "Lowest"]}
  //       value={sort}
  //       setValue={setSort}
  //     />
  //     <div className="flex flex-col">
  //       {data.pages.map((page) =>
  //         page.posts?.map((post) => <div>{post.body}</div>)
  //       )}
  //     </div>
  //     <div ref={ref}>
  //       {isFetchingNextPage
  //         ? "Loading more..."
  //         : data.pages[0].posts == null
  //         ? "No posts"
  //         : "All posts loaded"}
  //     </div>
  //   </div>
  // )

  return <p>Posts</p>
}

export default PostFeed

import { useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { graphql } from "../gql"
import { useNavigate } from "react-router-dom"
import { pluralize } from "../utils/utils"
import abbreviate from "number-abbreviate"
import { AiOutlineSearch } from "react-icons/ai"

type UsersSearchBarProps = {
  debouncedSearch: string
  search: string
}

const getUsersSearchResultsDocument = graphql(/* GraphQL */ `
  query UsersSearch($input: UsersInput!) {
    users(input: $input) {
      edges {
        node {
          username
          created_at
          postsCount
          commentsCount
        }
      }
    }
  }
`)

const UsersSearchBar = ({ debouncedSearch, search }: UsersSearchBarProps) => {
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: [debouncedSearch],
    queryFn: () =>
      graphQLClient.request(getUsersSearchResultsDocument, {
        input: {
          filters: { usernameContains: debouncedSearch },
          paginate: { first: 5 },
        },
      }),
    keepPreviousData: true,
  })

  return (
    <div
      className={`absolute top-9 bg-white w-full border-r-2 border-b-2 border-l-2 border-gray-300 flex flex-col ${
        !data?.users?.edges && "hidden"
      }`}
    >
      {data?.users?.edges &&
        (data.users.edges.length ? (
          data.users.edges.map((edge, i) => (
            <div
              key={i}
              className="flex flex-col px-2 py-1 hover:bg-gray-200 cursor-pointer overflow-auto"
              onMouseDown={() => navigate("/signup")}
            >
              <span className="text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                {edge.node.username}
              </span>
              <p className="flex items-center gap-1 text-gray-500 xs-max:text-[10px] xs:text-xs">
                {abbreviate(edge.node.postsCount, 1)}{" "}
                {pluralize(edge.node.postsCount, "Post")} •{" "}
                {abbreviate(edge.node.commentsCount, 1)}{" "}
                {pluralize(edge.node.commentsCount, "Comment")}
              </p>
            </div>
          ))
        ) : (
          <span className="px-2 py-1 text-sm">No results</span>
        ))}
      <div
        className={`px-2 py-2 text-sm text-ellipses hover:bg-gray-200 border-t border-gray-300 text-ellipsis whitespace-nowrap overflow-hidden cursor-pointer ${
          !search && "hidden"
        }`}
        onMouseDown={() => navigate("/signup")}
      >
        <AiOutlineSearch className="w-4 h-4 inline-block mr-2" />
        Search for "{search}"
      </div>
    </div>
  )
}

export default UsersSearchBar

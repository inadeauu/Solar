import { useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../../utils/graphql"
import { graphql } from "../../graphql_codegen/gql"
import { useNavigate } from "react-router-dom"
import { pluralize } from "../../utils/utils"
import abbreviate from "number-abbreviate"

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

const UsersSearchBar = ({ debouncedSearch }: UsersSearchBarProps) => {
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
      className={`absolute top-[34px] bg-white w-full border-r border-b border-l border-neutral-300 flex flex-col ${
        !data?.users?.edges && "hidden"
      }`}
    >
      {data?.users?.edges &&
        (data.users.edges.length ? (
          data.users.edges.map((edge, i) => (
            <div
              key={i}
              className="flex flex-col px-2 py-1 hover:bg-neutral-200 cursor-pointer overflow-auto"
              onMouseDown={() => navigate(`/profile/${edge.node.username}`)}
            >
              <span className="text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                {edge.node.username}
              </span>
              <p className="flex items-center gap-1 text-neutral-500 xs-max:text-[10px] xs:text-xs">
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
    </div>
  )
}

export default UsersSearchBar

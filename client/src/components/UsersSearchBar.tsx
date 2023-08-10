import { useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { graphql } from "../gql"
import { Link } from "react-router-dom"

type UsersSearchBarProps = {
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
        }
      }
    }
  }
`)

const UsersSearchBar = ({ search }: UsersSearchBarProps) => {
  const { data } = useQuery({
    queryKey: [search],
    queryFn: () =>
      graphQLClient.request(getUsersSearchResultsDocument, {
        input: {
          filters: { usernameContains: search },
          paginate: { first: 5 },
        },
      }),
  })

  return (
    <div
      className={`absolute top-9 bg-white w-full border-r-2 border-b-2 border-l-2 border-black flex flex-col`}
    >
      {data?.users.edges.length
        ? data.users.edges.map((edge, i) => (
            <Link to="/signup" key={i} className="flex gap-2">
              <span>{edge.node.username}</span>
              <span>Posts: {edge.node.postsCount}</span>
              <span>Created: {edge.node.created_at}</span>
            </Link>
          ))
        : "No results"}
    </div>
  )
}

export default UsersSearchBar

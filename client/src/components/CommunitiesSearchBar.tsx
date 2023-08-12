import { useQuery } from "@tanstack/react-query"
import { graphql } from "../gql"
import { graphQLClient } from "../utils/graphql"
import { Link } from "react-router-dom"
import { pluralize } from "../utils/utils"

type CommunitiesSearchBarProps = {
  search: string
}

const getCommunitySearchResultsDocument = graphql(/* GraphQL */ `
  query CommunitiesSearch($input: CommunitiesInput!) {
    communities(input: $input) {
      edges {
        node {
          memberCount
          title
          created_at
        }
      }
    }
  }
`)

const CommunitiesSearchBar = ({ search }: CommunitiesSearchBarProps) => {
  const { data } = useQuery({
    queryKey: [search],
    queryFn: () =>
      graphQLClient.request(getCommunitySearchResultsDocument, {
        input: {
          filters: { titleContains: search },
          paginate: { first: 5 },
        },
      }),
    keepPreviousData: true,
  })

  return (
    <div
      className={`absolute top-9 bg-white w-full border-r-2 border-b-2 border-l-2 border-black flex flex-col ${
        !data?.communities?.edges && "hidden"
      }`}
    >
      {data?.communities?.edges ? (
        data.communities.edges.length ? (
          data.communities.edges.map((edge, i) => (
            <Link
              to="/signup"
              key={i}
              className="flex flex-col px-2 py-1 hover:bg-gray-200"
            >
              <span className="text-sm">{edge.node.title}</span>
              <span className="text-xs text-gray-500">
                {edge.node.memberCount}{" "}
                {pluralize(edge.node.memberCount, "Member")}
              </span>
            </Link>
          ))
        ) : (
          <span className="px-2 py-1">No results</span>
        )
      ) : (
        ""
      )}
    </div>
  )
}

export default CommunitiesSearchBar

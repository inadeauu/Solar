import { useQuery } from "@tanstack/react-query"
import { graphql } from "../../gql"
import { graphQLClient } from "../../utils/graphql"
import { useNavigate } from "react-router-dom"
import { pluralize } from "../../utils/utils"
import abbreviate from "number-abbreviate"
import { AiOutlineSearch } from "react-icons/ai"
import { translator } from "../../utils/uuid"

type CommunitiesSearchBarProps = {
  debouncedSearch: string
  search: string
}

const getCommunitySearchResultsDocument = graphql(/* GraphQL */ `
  query CommunitiesSearch($input: CommunitiesInput!) {
    communities(input: $input) {
      edges {
        node {
          id
          memberCount
          title
          created_at
        }
      }
    }
  }
`)

const CommunitiesSearchBar = ({
  debouncedSearch,
  search,
}: CommunitiesSearchBarProps) => {
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: [debouncedSearch],
    queryFn: () =>
      graphQLClient.request(getCommunitySearchResultsDocument, {
        input: {
          filters: { titleContains: debouncedSearch },
          paginate: { first: 5 },
        },
      }),
    keepPreviousData: true,
  })

  return (
    <div
      className={`absolute top-9 bg-white w-full border-r-2 border-b-2 border-l-2 border-gray-300 flex flex-col ${
        !data?.communities?.edges && "hidden"
      }`}
    >
      {data?.communities?.edges && data.communities.edges.length ? (
        data.communities.edges.map((edge) => {
          const id: string = translator.fromUUID(edge.node.id)

          return (
            <div
              key={edge.node.id}
              className="flex flex-col px-2 py-1 hover:bg-gray-200 cursor-pointer overflow-auto"
              onMouseDown={() => {
                navigate(`/communities/${edge.node.title}/${id}`)
              }}
            >
              <span className="text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                {edge.node.title}
              </span>
              <span className="text-xs text-gray-500 xs-max:text-[10px] xs:text-xs">
                {abbreviate(edge.node.memberCount, 1)}{" "}
                {pluralize(edge.node.memberCount, "Member")}
              </span>
            </div>
          )
        })
      ) : (
        <span className="px-2 py-1 text-sm">No results</span>
      )}
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

export default CommunitiesSearchBar

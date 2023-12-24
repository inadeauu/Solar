import { useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../../utils/graphql"
import { useNavigate } from "react-router-dom"
import { pluralize } from "../../utils/utils"
import abbreviate from "number-abbreviate"
import { translator } from "../../utils/uuid"
import { getCommunityFeedDocument } from "../../graphql/sharedDocuments"

type CommunitiesSearchBarProps = {
  debouncedSearch: string
  search: string
}

const CommunitiesSearchBar = ({ debouncedSearch }: CommunitiesSearchBarProps) => {
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: [debouncedSearch],
    queryFn: () =>
      graphQLClient.request(getCommunityFeedDocument, {
        input: {
          filters: { titleContains: debouncedSearch },
          paginate: { first: 5 },
        },
      }),
    keepPreviousData: true,
  })

  return (
    <div
      data-testid="communities-results"
      className={`absolute top-[34px] bg-white w-full border-r border-b border-l border-neutral-300 flex flex-col ${
        !data?.communities?.edges && "hidden"
      }`}
    >
      {data?.communities?.edges && data.communities.edges.length ? (
        data.communities.edges.map((edge) => {
          return (
            <div
              key={edge.node.id}
              className="flex flex-col px-2 py-1 hover:bg-neutral-200 cursor-pointer overflow-auto"
              onMouseDown={() => {
                navigate(`/communities/${translator.fromUUID(edge.node.id)}`)
              }}
            >
              <span className="text-sm text-ellipsis whitespace-nowrap overflow-hidden">{edge.node.title}</span>
              <span className="text-xs text-neutral-500 xs-max:text-[10px] xs:text-xs">
                {abbreviate(edge.node.memberCount, 1)} {pluralize(edge.node.memberCount, "Member")}
              </span>
            </div>
          )
        })
      ) : (
        <span className="px-2 py-1 text-sm">No results</span>
      )}
    </div>
  )
}

export default CommunitiesSearchBar

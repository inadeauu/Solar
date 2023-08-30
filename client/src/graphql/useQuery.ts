import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { CommunityQuery } from "../graphql_codegen/graphql"
import { getCommunityDocument } from "./sharedDocuments"

export const useCommunity = (
  id: string | undefined,
  options?: UseQueryOptions<CommunityQuery>
) =>
  useQuery<CommunityQuery>(
    ["community", id],
    () =>
      graphQLClient.request(getCommunityDocument, {
        input: {
          id: id ?? "",
        },
      }),
    options
  )

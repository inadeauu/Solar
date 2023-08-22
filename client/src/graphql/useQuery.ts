import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { CommunityQuery } from "../graphql_codegen/graphql"
import { getCommunityDocument } from "./sharedDocuments"

export const useCommunity = (
  communityId: string | undefined,
  options?: UseQueryOptions<CommunityQuery>
) =>
  useQuery<CommunityQuery>(
    [communityId],
    () =>
      graphQLClient.request(getCommunityDocument, {
        input: {
          id: communityId ?? "",
        },
      }),
    options
  )

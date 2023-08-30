import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { CommunityQuery, SinglePostQuery } from "../graphql_codegen/graphql"
import { getCommunityDocument, getPostDocument } from "./sharedDocuments"

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

export const usePost = (
  id: string | undefined,
  options?: UseQueryOptions<SinglePostQuery>
) =>
  useQuery<SinglePostQuery>(
    ["post", id],
    () =>
      graphQLClient.request(getPostDocument, {
        input: {
          id: id ?? "",
        },
      }),
    options
  )

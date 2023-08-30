import { UseQueryOptions, useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import {
  CommunityQuery,
  SingleCommentQuery,
  SinglePostQuery,
} from "../graphql_codegen/graphql"
import {
  getCommunityDocument,
  getPostDocument,
  getCommentDocumnet,
} from "./sharedDocuments"

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

export const useComment = (
  id: string | undefined,
  options?: UseQueryOptions<SingleCommentQuery>
) =>
  useQuery<SingleCommentQuery>(
    ["comment", id],
    () =>
      graphQLClient.request(getCommentDocumnet, {
        input: {
          id: id ?? "",
        },
      }),
    options
  )

import {
  CommunityQuery,
  PostFeedQuery,
  SinglePostQuery,
} from "../graphql_codegen/graphql"
import { Flatten } from "../types/shared"

export type Post =
  | Flatten<PostFeedQuery["posts"]["edges"]>["node"]
  | NonNullable<SinglePostQuery["post"]>
export type Community = NonNullable<CommunityQuery["community"]>

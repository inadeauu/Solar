import {
  CommunityQuery,
  CommentFeedQuery,
  PostFeedQuery,
  SinglePostQuery,
  GetUserQuery,
  ProfileCommentFeedQuery,
} from "../graphql_codegen/graphql"
import { Flatten } from "../types/shared"

export type User = NonNullable<GetUserQuery["user"]>
export type Post =
  | Flatten<PostFeedQuery["posts"]["edges"]>["node"]
  | NonNullable<SinglePostQuery["post"]>
export type Community = NonNullable<CommunityQuery["community"]>
export type Comment = Flatten<CommentFeedQuery["comments"]["edges"]>["node"]
export type ProfileComment = Flatten<
  ProfileCommentFeedQuery["comments"]["edges"]
>["node"]

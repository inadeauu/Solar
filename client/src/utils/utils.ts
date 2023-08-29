import { CommentOrderByType, PostOrderByType } from "../graphql_codegen/graphql"

export const pluralize = (count: number, noun: string, suffix = "s") => {
  if (count !== 1) {
    return noun + suffix
  }

  return noun
}

export const getReply = (count: number) => {
  if (count !== 1) {
    return "Replies"
  }

  return "Reply"
}

export const getPostOrderByType = (postOrderBy: string) => {
  switch (postOrderBy) {
    case "New":
      return PostOrderByType.New
    case "Old":
      return PostOrderByType.Old
    case "Top":
      return PostOrderByType.Top
    case "Low":
      return PostOrderByType.Low
    default:
      return PostOrderByType.New
  }
}

export const getCommentOrderByType = (commentOrderBy: string) => {
  switch (commentOrderBy) {
    case "New":
      return CommentOrderByType.New
    case "Old":
      return CommentOrderByType.Old
    case "Top":
      return CommentOrderByType.Top
    case "Low":
      return CommentOrderByType.Low
    default:
      return CommentOrderByType.New
  }
}

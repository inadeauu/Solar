import { createContext, useState } from "react"
import { CommentOrderByType } from "../graphql_codegen/graphql"

type CommentContextType = {
  commentOrderBy: string
  setCommentOrderBy: React.Dispatch<React.SetStateAction<string>>
  commentOrderByType: CommentOrderByType
}

export const CommentContext = createContext<CommentContextType>(
  {} as CommentContextType
)

type CommentProviderProps = {
  children: React.ReactNode
}

const CommentContextProvider = ({ children }: CommentProviderProps) => {
  const [commentOrderBy, setCommentOrderBy] = useState<string>("New")

  const getCommentOrderByType = () => {
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

  const value: CommentContextType = {
    commentOrderBy,
    setCommentOrderBy,
    commentOrderByType: getCommentOrderByType(),
  }

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  )
}

export default CommentContextProvider

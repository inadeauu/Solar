import { createContext, useState } from "react"
import { CommentOrderByType } from "../graphql_codegen/graphql"
import { getCommentOrderByType } from "../utils/utils"

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

  const value: CommentContextType = {
    commentOrderBy,
    setCommentOrderBy,
    commentOrderByType: getCommentOrderByType(commentOrderBy),
  }

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  )
}

export default CommentContextProvider

import { createContext, useState } from "react"
import { PostOrderByType } from "../graphql_codegen/graphql"
import { getPostOrderByType } from "../utils/utils"

type CommunityContextType = {
  postOrderBy: string
  setPostOrderBy: React.Dispatch<React.SetStateAction<string>>
  postOrderByType: PostOrderByType
}

export const CommunityContext = createContext<CommunityContextType>(
  {} as CommunityContextType
)

type CommunityProviderProps = {
  children: React.ReactNode
}

const CommunityContextProvider = ({ children }: CommunityProviderProps) => {
  const [postOrderBy, setPostOrderBy] = useState<string>("New")

  const value: CommunityContextType = {
    postOrderBy,
    setPostOrderBy,
    postOrderByType: getPostOrderByType(postOrderBy),
  }

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

export default CommunityContextProvider

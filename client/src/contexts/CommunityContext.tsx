import { createContext, useState } from "react"
import { PostOrderByType } from "../graphql_codegen/graphql"

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

  const getPostOrderByType = () => {
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

  const value: CommunityContextType = {
    postOrderBy,
    setPostOrderBy,
    postOrderByType: getPostOrderByType(),
  }

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

export default CommunityContextProvider

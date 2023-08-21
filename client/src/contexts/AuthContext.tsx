import { createContext } from "react"
import { ImSpinner11 } from "react-icons/im"
import { useQuery } from "@tanstack/react-query"
import { AuthUserQuery } from "../graphql_codegen/graphql"
import { graphql } from "../graphql_codegen/gql"
import { graphQLClient } from "../utils/graphql"

const authUserQueryDocument = graphql(/* GraphQL */ `
  query AuthUser {
    authUser {
      ... on AuthUserSuccess {
        __typename
        successMsg
        code
        user {
          username
          updated_at
          provider
          id
          created_at
        }
      }
    }
  }
`)

export interface AuthContextType {
  user: AuthUserQuery["authUser"]["user"]
}

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoading, data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => graphQLClient.request(authUserQueryDocument),
  })

  const value: AuthContextType = {
    user: data?.authUser.user,
  }

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="h-screen flex items-center justify-center">
          <ImSpinner11 className="animate-spin h-32 w-32" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export default AuthProvider

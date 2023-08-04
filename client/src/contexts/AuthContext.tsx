import { createContext } from "react"
import { ImSpinner11 } from "react-icons/im"
import { useQuery } from "@tanstack/react-query"
import { api } from "../utils/axios"

type AuthProviderProps = {
  children: React.ReactNode
}

type User = {
  id: string
  username: string
  email: string
  email_verified: boolean
  provider: string
  image: string
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: User | null | undefined
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoading, data } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get("/auth/user")

      if (response.data.data.user) {
        return response.data.data.user as User
      } else {
        return null
      }
    },
  })

  const value: AuthContextType = {
    user: data,
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

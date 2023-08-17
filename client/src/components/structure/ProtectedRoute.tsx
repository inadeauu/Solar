import { useAuth } from "../../utils/useAuth"
import { Outlet, Navigate } from "react-router-dom"

const ProtectedRoute = () => {
  const { user } = useAuth()

  return user ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute

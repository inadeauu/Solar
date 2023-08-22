import { useAuth } from "../../hooks/useAuth"
import { Outlet, Navigate } from "react-router-dom"

const ProtectedRoute = () => {
  const { user } = useAuth()

  return user ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute

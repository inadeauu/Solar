import AuthProvider from "../../contexts/AuthContext"
import { Outlet } from "react-router-dom"
import Navbar from "../navbar/Navbar"

const Layout = () => {
  return (
    <AuthProvider>
      <div className="min-w-[320px]">
        <Navbar />
        <div className="p-4 max-w-4xl mx-auto">
          <Outlet />
        </div>
      </div>
    </AuthProvider>
  )
}

export default Layout

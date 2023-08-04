import AuthProvider from "../contexts/AuthContext"
import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <AuthProvider>
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto">
        <Outlet />
      </div>
    </AuthProvider>
  )
}

export default Layout

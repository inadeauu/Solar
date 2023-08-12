import { Link } from "react-router-dom"

const NavUnauth = () => {
  return (
    <div className="flex gap-2">
      <Link to="/signup" className="btn_blue px-3 py-1 whitespace-nowrap">
        Sign Up
      </Link>
      <Link to="/login" className="btn_blue px-3 py-1 whitespace-nowrap">
        Log In
      </Link>
    </div>
  )
}

export default NavUnauth

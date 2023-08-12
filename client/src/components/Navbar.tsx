import { Link } from "react-router-dom"
import { useAuth } from "../utils/useAuth"
import NavProfile from "./NavProfile"
import SearchBar from "./SearchBar"
import NavUnauth from "./NavUnauth"

const Navbar = () => {
  const { user } = useAuth()

  return (
    <header className="border-b-2 border-gray-200 bg-white h-16 sticky top-0 z-[1000]">
      <nav className="flex mx-auto items-center max-w-5xl justify-between h-full px-4 gap-6">
        <Link to="/" className="text-3xl font-bold">
          Social
        </Link>
        <SearchBar />
        {!user ? <NavUnauth /> : <NavProfile />}
      </nav>
    </header>
  )
}

export default Navbar

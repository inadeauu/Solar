import { useRef, useState } from "react"
import useClickOutside from "../utils/useClickOutside"
import { Link } from "react-router-dom"
import { BsPlusCircle } from "react-icons/bs"
import { CiLogin } from "react-icons/ci"

const NavUnauth = () => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [openMenu, setOpenMenu] = useState<boolean>(false)

  useClickOutside(menuRef, () => {
    if (openMenu) {
      setOpenMenu((prev) => !prev)
    }
  })

  return (
    <div
      ref={menuRef}
      className="relative"
      onClick={() => setOpenMenu((prev) => !prev)}
    >
      <Link to="/signup" className="btn_blue p-2">
        Log In
      </Link>
      {openMenu && (
        <div className="absolute right-0 top-10 bg-gray-50 w-[150px] outline outline-2 outline-black rounded-md text-md">
          <Link
            to="/signup"
            className="flex items-center gap-2 p-1 rounded-t-md hover:bg-gray-200 hover:cursor-pointer"
          >
            <BsPlusCircle className="w-5 h-5" />
            Sign up
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 p-1 rounded-b-md hover:bg-gray-200 hover:cursor-pointer"
          >
            <CiLogin className="w-5 h-5" />
            Login
          </Link>
        </div>
      )}
    </div>
  )
}

export default NavUnauth

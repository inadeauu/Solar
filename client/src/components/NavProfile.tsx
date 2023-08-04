import { useRef, useState } from "react"
import ProfileImage from "./ProfileImage"
import { CiLogout } from "react-icons/ci"
import useClickOutside from "../utils/useClickOutside"
import { BsHouseAdd } from "react-icons/bs"
import { Link } from "react-router-dom"
import { api } from "../utils/axios"
import { useQueryClient } from "@tanstack/react-query"

const NavProfile = () => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const logout = async () => {
    await api.post("/auth/logout")
    queryClient.invalidateQueries({ queryKey: ["user"] })
  }

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
      <ProfileImage className="h-10 w-10 hover:cursor-pointer" />
      {openMenu && (
        <div className="absolute right-0 top-10 bg-gray-50 w-[200px] outline outline-2 outline-black rounded-md">
          <Link
            to="/create-community"
            className="flex items-center gap-2 p-1 rounded-t-md hover:bg-gray-200 hover:cursor-pointer"
          >
            <BsHouseAdd className="h-5 w-5" />
            <span className="text-md">Create a Community</span>
          </Link>
          <div
            className="flex items-center gap-2 p-1 rounded-b-md hover:bg-gray-200 hover:cursor-pointer"
            onClick={() => logout()}
          >
            <CiLogout className="h-5 w-5" />
            <span className="text-md">Log out</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavProfile

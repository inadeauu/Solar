import { useRef, useState } from "react"
import { CiLogout } from "react-icons/ci"
import useClickOutside from "../utils/useClickOutside"
import { BsHouseAdd, BsPerson } from "react-icons/bs"
import { Link } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphql } from "../gql"
import { graphQLClient } from "../utils/graphql"
import { useAuth } from "../utils/useAuth"
import { RiArrowDropUpLine, RiArrowDropDownLine } from "react-icons/Ri"

const logoutDocument = graphql(/* GraphQL */ `
  mutation Logout {
    logout {
      ... on LogoutSuccess {
        __typename
        successMsg
        code
      }
      ... on Error {
        __typename
        errorMsg
        code
      }
    }
  }
`)

const NavProfile = () => {
  const { user } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const logout = useMutation({
    mutationFn: async () => {
      return graphQLClient.request(logoutDocument)
    },
    onSuccess: (data) => {
      if (data.logout.__typename == "LogoutSuccess") {
        queryClient.invalidateQueries({ queryKey: ["user"] })
      }
    },
  })

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
      <div className="border-[1px] rounded-lg border-black pl-2 pr-1 py-1 hover:cursor-pointer flex items-center justify-between">
        <BsPerson className="w-7 h-7 hover:cursor-pointer lg:hidden" />
        <span className="text-[12px] font-bold lg-max:hidden">
          {user?.username}
        </span>
        <span className="pointer-events-none">
          {openMenu ? (
            <RiArrowDropUpLine className="w-6 h-6" />
          ) : (
            <RiArrowDropDownLine className="w-6 h-6" />
          )}
        </span>
      </div>
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
            onClick={() => logout.mutate()}
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

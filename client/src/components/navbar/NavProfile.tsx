import { useRef, useState } from "react"
import { CiLogout } from "react-icons/ci"
import useClickOutside from "../../hooks/useClickOutside"
import { BsHouseAdd, BsPerson } from "react-icons/bs"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { graphql } from "../../graphql_codegen/gql"
import { graphQLClient } from "../../utils/graphql"
import { useAuth } from "../../hooks/useAuth"
import { RiArrowDropUpLine, RiArrowDropDownLine } from "react-icons/Ri"

const logoutDocument = graphql(/* GraphQL */ `
  mutation Logout {
    logout {
      ... on LogoutSuccess {
        __typename
        successMsg
        code
      }
    }
  }
`)

const NavProfile = () => {
  const { user } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)
  const [openMenu, setOpenMenu] = useState<boolean>(false)

  const logout = useMutation({
    mutationFn: async () => {
      return graphQLClient.request(logoutDocument)
    },
    onSuccess: (data) => {
      if (data.logout.__typename == "LogoutSuccess") {
        window.location.reload()
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
      <div
        className={`bg-white border-2 border-neutral-300 hover:border-neutral-400 rounded-md pl-2 pr-1 py-1 hover:cursor-pointer flex items-center justify-between ${
          openMenu && "border-neutral-400"
        }`}
      >
        <BsPerson className="w-7 h-7 hover:cursor-pointer sm:hidden" />
        <span className="text-[12px] font-semibold sm-max:hidden">
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
        <div className="absolute right-0 top-11 bg-white w-[200px] border border-neutral-300 rounded-md text-sm font-medium">
          <Link
            to="/create-community"
            className="flex items-center gap-2 p-2 rounded-t-md hover:bg-neutral-200 hover:cursor-pointer"
          >
            <div className="w-[15%]">
              <BsHouseAdd className="h-5 w-5" />
            </div>
            Create a Community
          </Link>
          <div
            className="flex items-center gap-2 p-2 rounded-b-md hover:bg-neutral-200 hover:cursor-pointer"
            onClick={() => logout.mutate()}
          >
            <div className="w-[15%]">
              <CiLogout className="h-5 w-5" />
            </div>
            Log Out
          </div>
        </div>
      )}
    </div>
  )
}

export default NavProfile

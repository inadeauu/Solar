import { useRef, useState } from "react"
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/Ri"
import { BsPerson, BsPersonPlus } from "react-icons/bs"
import { FiLogIn } from "react-icons/fi"
import { Link } from "react-router-dom"
import useClickOutside from "../../utils/useClickOutside"

const NavUnauth = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useClickOutside(menuRef, () => {
    if (openMenu) {
      setOpenMenu((prev) => !prev)
    }
  })

  return (
    <>
      <div className="flex gap-2 xs-max:hidden">
        <Link to="/signup" className="btn_blue px-3 py-1 whitespace-nowrap">
          Sign Up
        </Link>
        <Link to="/login" className="btn_blue px-3 py-1 whitespace-nowrap">
          Log In
        </Link>
      </div>
      <div
        ref={menuRef}
        className="relative xs:hidden"
        onClick={() => setOpenMenu((prev) => !prev)}
      >
        <div
          className={`border-2 border-neutral-300 hover:border-neutral-400 rounded-md pl-2 pr-1 py-1 hover:cursor-pointer flex items-center justify-between ${
            openMenu && "border-neutral-400"
          }`}
        >
          <BsPerson className="w-7 h-7 hover:cursor-pointer lg:hidden" />
          <span className="pointer-events-none">
            {openMenu ? (
              <RiArrowDropUpLine className="w-6 h-6" />
            ) : (
              <RiArrowDropDownLine className="w-6 h-6" />
            )}
          </span>
        </div>
        {openMenu && (
          <div className="absolute right-0 top-11 bg-neutral-50 w-[110px] border border-neutral-300 rounded-md text-sm font-medium">
            <Link
              to="/signup"
              className="flex items-center gap-2 p-2 rounded-t-md hover:bg-neutral-200 hover:cursor-pointer"
            >
              <div className="w-[25%]">
                <BsPersonPlus className="w-5 h-5" />
              </div>
              Sign Up
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 p-2 rounded-b-md hover:bg-neutral-200 hover:cursor-pointer"
            >
              <div className="w-[25%]">
                <FiLogIn className="w-4 h-4 mr-auto" />
              </div>
              Log In
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default NavUnauth

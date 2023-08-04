import { useRef, useState } from "react"
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"
import useClickOutside from "../utils/useClickOutside"

type DropdownProps = {
  width: string
  items: string[]
  value: string
  setValue: (option: string) => void
}

const Dropdown = ({ width, items, value, setValue }: DropdownProps) => {
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
      className="bg-gray-50 flex flex-col text-sm py-1 relative rounded-md outline outline-2 outline-black w-fit"
      onClick={() => setOpenMenu((prev) => !prev)}
    >
      <div
        className={`flex px-2 items-center justify-between cursor-pointer transition-all duration-200 ${width}`}
      >
        {value}
        <span className="pointer-events-none">
          {openMenu ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
        </span>
      </div>
      {openMenu && (
        <ul
          className={`absolute top-10 left-0 bg-gray-50 rounded-md outline outline-2 outline-black ${width}`}
        >
          {items.map((item, i) => (
            <li
              key={item}
              className={`cursor-pointer py-[2px] hover:bg-gray-200 pl-2 ${
                i == 0 && items.length == 1
                  ? "rounded-md"
                  : i == 0
                  ? "rounded-t-md"
                  : i == items.length - 1 && "rounded-b-md"
              }`}
              onClick={() => setValue(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown

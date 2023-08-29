import { useRef, useState } from "react"
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"
import useClickOutside from "../../hooks/useClickOutside"

type DropdownProps = {
  className?: string
  width: string
  items: string[]
  value?: string
  constValue?: React.ReactNode
  setValue: (option: string) => void
}

const Dropdown = ({
  className,
  width,
  items,
  value,
  setValue,
  constValue,
}: DropdownProps) => {
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
      className={`flex items-center gap-1 px-2 text-sm relative rounded-md font-medium bg-white border border-neutral-300 hover:border-neutral-400 cursor-pointer w-fit ${className} ${
        openMenu && "border-neutral-400"
      }`}
      onClick={() => setOpenMenu((prev) => !prev)}
    >
      {constValue ? constValue : value}
      <span className="pointer-events-none">
        {openMenu ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
      </span>
      {openMenu && (
        <ul
          className={`absolute top-10 left-0 bg-white rounded-md outline outline-1 outline-neutral-300 ${width}`}
        >
          {items.map((item, i) => (
            <li
              key={item}
              className={`cursor-pointer p-2 hover:bg-neutral-200 ${
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

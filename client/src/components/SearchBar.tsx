import { useRef, useState } from "react"
import Dropdown from "./Dropdown"
import useDebounce from "../utils/useDebounce"
import useClickOutside from "../utils/useClickOutside"
import CommunitiesSearchBar from "./CommunitiesSearchBar"
import UsersSearchBar from "./UsersSearchBar"
import { PiMagnifyingGlassBold } from "react-icons/pi"

const SearchBar = () => {
  const searchRef = useRef<HTMLDivElement>(null)
  const [search, setSearch] = useState<string>("")
  const [searchType, setSearchType] = useState<string>("Communities")
  const [showResults, setShowResults] = useState<boolean>(false)

  const debouncedSearch = useDebounce(search, 500)

  useClickOutside(searchRef, () => {
    if (showResults) {
      setShowResults((prev) => !prev)
    }
  })

  return (
    <div className="flex items-stretch gap-2 w-[50%] leading-1">
      <div ref={searchRef} className="flex flex-col w-full relative">
        <input
          value={search}
          placeholder={`Search ${searchType}...`}
          className={`px-2 py-1 rounded-md border-2 border-gray-300 outline-none bg-gray-50 hover:border-blue-400 focus:border-blue-400 w-full ${
            showResults && "rounded-b-none"
          }`}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowResults((prev) => !prev)}
        />
        {showResults &&
          debouncedSearch &&
          (searchType == "Communities" ? (
            <CommunitiesSearchBar search={debouncedSearch} />
          ) : (
            <UsersSearchBar search={debouncedSearch} />
          ))}
      </div>
      <Dropdown
        width="w-[110px]"
        items={["Communities", "Users"]}
        constValue={<PiMagnifyingGlassBold className="h-5 w-5" />}
        setValue={setSearchType}
      />
    </div>
  )
}

export default SearchBar

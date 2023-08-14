import { useRef, useState } from "react"
import Dropdown from "./Dropdown"
import useDebounce from "../utils/useDebounce"
import CommunitiesSearchBar from "./CommunitiesSearchBar"
import UsersSearchBar from "./UsersSearchBar"
import { PiMagnifyingGlassBold } from "react-icons/pi"

const SearchBar = () => {
  const searchRef = useRef<HTMLDivElement>(null)
  const [search, setSearch] = useState<string>("")
  const [searchType, setSearchType] = useState<string>("Communities")
  const [showResults, setShowResults] = useState<boolean>(false)

  const debouncedSearch = useDebounce(search, 500)

  return (
    <div className="flex items-stretch gap-2 w-[50%] h-[60%] leading-1">
      <div ref={searchRef} className="flex flex-col w-full relative">
        <input
          value={search}
          placeholder={`Search ${searchType}`}
          className={`px-2 py-1 rounded-md border-2 border-gray-300 outline-none bg-gray-50 hover:border-blue-400 focus:border-blue-400 w-full placeholder-shown:text-ellipsis ${
            showResults && "rounded-b-none"
          }`}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            setShowResults((prev) => !prev)
          }}
          onBlur={() => {
            setShowResults((prev) => !prev)
          }}
        />
        {debouncedSearch &&
          showResults &&
          (searchType == "Communities" ? (
            <CommunitiesSearchBar
              debouncedSearch={debouncedSearch}
              search={search}
            />
          ) : (
            <UsersSearchBar debouncedSearch={debouncedSearch} search={search} />
          ))}
      </div>
      <Dropdown
        className={`${showResults && "sm-max:hidden"}`}
        width="w-[110px]"
        items={["Communities", "Users"]}
        constValue={<PiMagnifyingGlassBold className="h-5 w-5" />}
        setValue={setSearchType}
      />
    </div>
  )
}

export default SearchBar

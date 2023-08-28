import { useRef, useState } from "react"
import Dropdown from "../misc/Dropdown"
import useDebounce from "../../hooks/useDebounce"
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
    <div className="flex items-stretch gap-2 w-[50%]">
      <div ref={searchRef} className="flex flex-col w-full relative">
        <input
          value={search}
          placeholder={`Search ${searchType}`}
          className={`px-2 py-1 rounded-md border border-neutral-300 outline-none bg-neutral-50 hover:border-blue-400 focus:border-blue-400 w-full xs-max:placeholder:text-xs placeholder-shown:text-ellipsis ${
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

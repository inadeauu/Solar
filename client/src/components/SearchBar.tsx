import { useEffect, useRef, useState } from "react"
import Dropdown from "./Dropdown"
import { api } from "../utils/axios"
import { Community, User } from "../types/api"
import useDebounce from "../utils/useDebounce"
import { Link } from "react-router-dom"
import useClickOutside from "../utils/useClickOutside"

type Dropdown = {
  dropdown: string
  value: string
}

const DDVals: Record<string, Dropdown> = {
  community: {
    dropdown: "Communities",
    value: "community",
  },
  user: {
    dropdown: "Users",
    value: "user",
  },
}

const SearchBar = () => {
  const searchRef = useRef<HTMLDivElement>(null)
  const [search, setSearch] = useState<string>("")
  const [searchType, setSearchType] = useState<Dropdown>(DDVals.community)
  const [showResults, setShowResults] = useState<boolean>(false)

  const [searchResults, setSearchResults] = useState<
    Community[] | User[] | null | undefined
  >(undefined)

  const debouncedSearch = useDebounce(search, 500)

  useClickOutside(searchRef, () => {
    if (showResults) {
      setShowResults((prev) => !prev)
    }
  })

  const handleSearchType = (option: string) => {
    if (option == DDVals.community.dropdown) {
      setSearchType(DDVals.community)
    } else if (option == DDVals.user.dropdown) {
      setSearchType(DDVals.user)
    }
  }

  useEffect(() => {
    const getSearchResults = async () => {
      const response = await api.get(`/${searchType.value}`, {
        params: { count: 5 },
      })

      if (response.data.data.results.length) {
        setSearchResults(response.data.data.results)
      } else {
        setSearchResults(null)
      }
    }

    if (debouncedSearch) {
      getSearchResults()
    } else {
      setSearchResults(undefined)
    }
  }, [debouncedSearch, searchType.value])

  return (
    <div className="flex items-center gap-2 w-[60%]">
      <div ref={searchRef} className="flex flex-col w-full relative">
        <input
          value={search}
          placeholder={`Search ${searchType.dropdown}...`}
          className={`rounded-md p-1 border-2 border-black outline-none bg-gray-50 hover:border-blue-400 focus:border-blue-400 w-full ${
            showResults && "rounded-b-none"
          }`}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowResults((prev) => !prev)}
        />
        {showResults && (
          <div
            className={`absolute top-9 bg-white w-full border-r-2 border-b-2 border-l-2 border-black flex flex-col ${
              searchResults === undefined && "hidden"
            }`}
          >
            {searchResults
              ? searchResults.map((result) => (
                  <Link key={result.id} to="/signup">
                    {result.kind === "COMMUNITY" && (
                      <div>Community: {result.title}</div>
                    )}
                    {result.kind === "USER" && (
                      <div>User: {result.username}</div>
                    )}
                  </Link>
                ))
              : searchResults === null && <p>No results</p>}
          </div>
        )}
      </div>
      <Dropdown
        width="w-[125px]"
        items={Object.keys(DDVals).map((key) => DDVals[key].dropdown)}
        value={searchType.dropdown}
        setValue={handleSearchType}
      />
    </div>
  )
}

export default SearchBar

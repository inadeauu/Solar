import { useEffect } from "react"

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (
        e.target instanceof Node &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        callback()
      }
    }

    document.addEventListener("click", clickOutside)

    return () => {
      document.removeEventListener("click", clickOutside)
    }
  })
}

export default useClickOutside

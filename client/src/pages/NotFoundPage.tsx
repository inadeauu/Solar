import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="flex h-screen justify-center mt-[125px]">
      <div className="flex flex-col items-center gap-4 h-fit">
        <h1 className="font-bold text-5xl">404 Not Found</h1>
        <span className="text-xl">The requested page does not exist.</span>
        <Link to="/" className="btn_blue px-4 py-1">
          Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage

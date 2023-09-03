import HomePostFeed from "../components/home/HomePostFeed"

const HomePage = () => {
  return (
    <div className="flex flex-col gap-2 md-max:w-full min-w-0 break-words">
      <h1 className="text-2xl font-bold">Home</h1>
      <HomePostFeed />
    </div>
  )
}

export default HomePage

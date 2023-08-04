import PostFeed from "../components/PostFeed"

const Home = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Home</h1>
      <PostFeed />
    </div>
  )
}

export default Home

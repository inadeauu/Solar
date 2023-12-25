import { Navigate, useParams } from "react-router-dom"
import { ImSpinner11 } from "react-icons/im"
import CommunitySidebar from "../components/community/CommunitySidebar"
import CommunityPostFeed from "../components/community/CommunityPostFeed"
import CommunityPostForm from "../components/community/CommunityPostForm"
import CommunityHeader from "../components/community/CommunityHeader"
import { useCommunity } from "../graphql/useQuery"
import { useContext } from "react"
import Dropdown from "../components/misc/Dropdown"
import { CommunityContext } from "../contexts/CommunityContext"
import { translator } from "../utils/uuid"

const CommunityPage = () => {
  const { id } = useParams()
  const { data, isLoading } = useCommunity(translator.toUUID(id || ""))

  const { postOrderBy, setPostOrderBy } = useContext(CommunityContext)

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  } else if (!data?.community) {
    return <Navigate to="/404-not-found" />
  }

  return (
    <section className="flex gap-6">
      <div className="flex flex-col gap-5 md:grow md-max:w-full min-w-0 break-words">
        <CommunityHeader community={data.community} />
        <CommunityPostForm community={data.community} />
        <Dropdown
          name="order"
          className="py-1"
          width="w-[65px]"
          items={["New", "Old", "Top", "Low"]}
          value={postOrderBy}
          setValue={setPostOrderBy}
        />
        <CommunityPostFeed community={data.community} />
      </div>
      <CommunitySidebar community={data.community} />
    </section>
  )
}

export default CommunityPage

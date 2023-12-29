import { ImSpinner11 } from "react-icons/im"
import { usePost } from "../graphql/useQuery"
import { translator } from "../utils/uuid"
import { Navigate, useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import EditPostForm from "../components/post/edit/EditPostForm"

const EditPostPage = () => {
  const { user } = useAuth()
  const { id } = useParams()
  const { data, isLoading } = usePost(translator.toUUID(id ?? ""))

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  } else if (!data?.post) {
    return <Navigate to="/404-not-found" />
  } else if (data.post.owner.id !== user?.id) {
    return <Navigate to="/" />
  }

  return (
    <div className="flex flex-col gap-5 sm:w-[80%] sm-max:w-full break-words min-w-0 mx-auto">
      <EditPostForm post={data.post} />
    </div>
  )
}

export default EditPostPage

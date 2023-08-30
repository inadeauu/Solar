import { ImSpinner11 } from "react-icons/im"
import { translator } from "../utils/uuid"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useComment } from "../graphql/useQuery"
import EditCommentForm from "../components/comment/edit/EditCommentForm"

const EditCommentPage = () => {
  const { user } = useAuth()
  const { id } = useParams()
  const { data, isLoading } = useComment(translator.toUUID(id ?? ""))
  const navigate = useNavigate()

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  } else if (!data?.comment) {
    return <Navigate to="/404-not-found" />
  } else if (data.comment.owner.id !== user?.id) {
    navigate(-1)
  }

  return (
    <div className="flex flex-col gap-5 sm:w-[80%] sm-max:w-full break-words min-w-0 mx-auto">
      <EditCommentForm comment={data.comment} />
    </div>
  )
}

export default EditCommentPage

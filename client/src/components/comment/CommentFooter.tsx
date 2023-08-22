import type { Comment } from "../../graphql/types"

type CommentFooterProps = {
  comment: Comment
  queryKey: any[]
}

const CommentFooter = ({ comment, queryKey }: CommentFooterProps) => {
  return <div>CommentFooter</div>
}

export default CommentFooter

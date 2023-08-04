import { useAuth } from "../utils/useAuth"
import { CgProfile } from "react-icons/cg"

type ProfileImageProps = {
  className: string
  [x: string]: any
}

const ProfileImage = ({ className, ...props }: ProfileImageProps) => {
  const { user } = useAuth()

  return user && user.provider !== "EMAIL" ? (
    <img className={`rounded-full ${className}`} src={user.image} {...props} />
  ) : (
    <CgProfile className={className} {...props} />
  )
}

export default ProfileImage

export type User = {
  kind: "USER"
  id: string
  username: string
  email: string
  email_verified: boolean
  provider: "EMAIL" | "GOOGLE" | "GITHUB"
  image?: string
  created_at: Date
  updated_at: Date
}

export type Post = {
  id: string
  userId: string
  communityId: string
  body: string
  created_at: Date
  updated_at: Date
}

export type Community = {
  kind: "COMMUNITY"
  id: string
  userId: string
  title: string
  created_at: Date
  updated_at: Date
}

export type PostPage = {
  posts?: Post[]
  cursor: string
}

export type ErrorResponse = {
  error: {
    message: string | null
    status: number
    timestamp: string
    path: string
  }
}

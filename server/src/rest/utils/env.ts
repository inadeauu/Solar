import z from "zod"

const envSchema = z.object({
  CLIENT_URL: z.string(),
  COOKIE_SECRET: z.string(),
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URL: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_REDIRECT_URL: z.string(),
})

export const env = envSchema.parse(process.env)

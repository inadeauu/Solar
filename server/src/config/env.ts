import z from "zod"

const envSchema = z.object({
  COOKIE_SECRET: z.string(),
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)

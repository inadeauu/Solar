import { Express } from "express"
import {
  githubCallback,
  githubLogin,
  googleCallback,
  googleLogin,
} from "./controllers/authController"

function routes(app: Express) {
  app.get("/api/auth/google", googleLogin)
  app.get("/api/auth/google/callback", googleCallback)

  app.get("/api/auth/github", githubLogin)
  app.get("/api/auth/github/callback", githubCallback)
}

export default routes

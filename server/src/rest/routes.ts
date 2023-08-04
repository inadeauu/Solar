import { Express } from "express"
import {
  githubCallback,
  githubLogin,
  googleCallback,
  googleLogin,
  logout,
} from "./controllers/authController"
import { verifyUser } from "./middleware/verifyUser"

function routes(app: Express) {
  app.get("/api/auth/google", googleLogin)
  app.get("/api/auth/google/callback", googleCallback)

  app.get("/api/auth/github", githubLogin)
  app.get("/api/auth/github/callback", githubCallback)

  app.post("/api/auth/logout", verifyUser, logout)
}

export default routes

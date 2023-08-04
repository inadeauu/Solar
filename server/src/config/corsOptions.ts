import cors from "cors"

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4000",
  "https://sandbox.embed.apollographql.com",
]

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

import { BrowserRouter } from "react-router-dom"
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import { toast } from "react-toastify"
import { ClientError } from "graphql-request"

const queryCache = new QueryCache({
  onError: (error) => {
    if (error instanceof ClientError) {
      error.response.errors?.forEach(({ message, path }) => {
        toast.error(message, { toastId: path?.toString() })
      })
    }
  },
})

const mutationCache = new MutationCache({
  onSuccess: (data: any) => {
    if ("errorMsg" in data && "inputErrors" in data) {
      toast.error("Invalid input", { toastId: data.errorMsg })
    }
  },
  onError: (error, _0, _1, mutation) => {
    if (mutation.options.onError || mutation.options.onSettled) return

    if (error instanceof ClientError) {
      error.response.errors?.forEach(({ message, path }) => {
        toast.error(message, { toastId: path?.toString() })
      })
    }
  },
})

const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  logger: { log: () => {}, warn: () => {}, error: () => {} },
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)

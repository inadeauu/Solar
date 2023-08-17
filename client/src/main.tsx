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
      error.response.errors?.forEach(({ message }) => {
        toast.error(message)
      })
    }
  },
})

const mutationCache = new MutationCache({
  onError: (error) => {
    if (error instanceof ClientError) {
      error.response.errors?.forEach(({ message }) => {
        toast.error(message)
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

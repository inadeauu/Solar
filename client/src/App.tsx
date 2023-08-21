import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import Layout from "./components/structure/Layout"
import CreateCommunityPage from "./pages/CreateCommunityPage"
import ProtectedRoute from "./components/structure/ProtectedRoute"
import CommunityPage from "./pages/CommunityPage"
import NotFoundPage from "./pages/NotFoundPage"
import { ToastContainer, Zoom } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import PostPage from "./pages/PostPage"

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Zoom}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="create-community" element={<CreateCommunityPage />} />
          </Route>
          <Route path="communities/:title/:id" element={<CommunityPage />} />
          <Route path="posts/:title/:id" element={<PostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  )
}

export default App

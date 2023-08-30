import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import Layout from "./components/structure/Layout"
import CreateCommunityPage from "./pages/CreateCommunityPage"
import ProtectedRoute from "./components/structure/ProtectedRoute"
import CommunityPage from "./pages/CommunityPage"
import NotFoundPage from "./pages/NotFoundPage"
import "react-toastify/dist/ReactToastify.css"
import PostPage from "./pages/PostPage"
import CommentContextProvider from "./contexts/CommentContext"
import CommunityContextProvider from "./contexts/CommunityContext"
import AccountSettingsPage from "./pages/AccountSettingsPage"
import { ToastContainer, Zoom } from "react-toastify"
import ProfilePage from "./pages/ProfilePage"
import CommunitySettingsPage from "./pages/CommunitySettingsPage"

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
            <Route path="settings" element={<AccountSettingsPage />} />
            <Route
              path="communities/:id/settings"
              element={<CommunitySettingsPage />}
            />
          </Route>
          <Route
            path="communities/:id"
            element={
              <CommunityContextProvider>
                <CommunityPage />
              </CommunityContextProvider>
            }
          />
          <Route
            path="posts/:id"
            element={
              <CommentContextProvider>
                <PostPage />
              </CommentContextProvider>
            }
          />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  )
}

export default App

import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Layout from "./components/Layout"
import CreateCommunity from "./pages/CreateCommunity"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="create-community" element={<CreateCommunity />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App

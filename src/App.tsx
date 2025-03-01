import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { useAuthStore } from "./store/authStore";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { UploadDocument } from "./components/UploadDocument";
import { ViewDocument } from "./pages/ViewDocument";


function App() {
  const { user, role } = useAuthStore();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              user ? (
                role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <UserDashboard />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="scan" element={<UploadDocument />} />
          <Route path="/view/:id" element={<ViewDocument />} />
          {/* Redirect unknown paths */}
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

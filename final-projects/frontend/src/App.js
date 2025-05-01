import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import FilesPage from "./pages/FilesPage";
import DashboardLayout from "./layouts/DashboardLayout";

const PrivateRoute = ({ children }) => {
  // Token kontrolünü kaldırıyoruz, doğrudan dashboard layoutu gösteriyoruz
  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/roles"
          element={
            <PrivateRoute>
              <RolesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/files"
          element={
            <PrivateRoute>
              <FilesPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

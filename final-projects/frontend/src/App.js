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
import UserRolesPage from "./pages/UserRolesPage";
import FilesPage from "./pages/FilesPage";
import DashboardLayout from "./layouts/DashboardLayout";
import TasksPage from "./pages/TasksPage";
import LogViewerSidebar from "./components/LogViewerSidebar";
import Prometheus from "./pages/tasks/Prometheus";
import MetricsPage from "./pages/MetricsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin only routes */}
          <Route
            index
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute requireAdmin={true}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="roles"
            element={
              <ProtectedRoute requireAdmin={true}>
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="roles/user-roles"
            element={
              <ProtectedRoute requireAdmin={true}>
                <UserRolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="files"
            element={
              <ProtectedRoute requireAdmin={true}>
                <FilesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="log-viewer"
            element={
              <ProtectedRoute requireAdmin={true}>
                <LogViewerSidebar />
              </ProtectedRoute>
            }
          />
          <Route
            path="prometheus"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Prometheus />
              </ProtectedRoute>
            }
          />
          <Route
            path="metrics"
            element={
              <ProtectedRoute requireAdmin={true}>
                <MetricsPage />
              </ProtectedRoute>
            }
          />

          {/* Routes accessible to all authenticated users */}
          <Route path="tasks/*" element={<TasksPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

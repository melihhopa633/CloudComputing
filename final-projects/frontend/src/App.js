import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

const Dashboard = () => {
  return (
    <div className="auth-container">
      <h2>Dashboard</h2>
      <p>Welcome! You are logged in.</p>
      <button
        onClick={() => {
          localStorage.removeItem("jwtToken");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken");
  return token ? children : <Navigate to="/login" />;
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
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

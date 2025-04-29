import React, { useState } from "react";
import authService from "../services/authService";
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  React.useEffect(() => {
    setShow(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authService.login(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-bg">
      <div className={`glass-card ${show ? "fade-in-up" : ""}`}> 
        <h2 className="login-title">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass-input"
              autoComplete="username"
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-input"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="glass-btn">Login</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;



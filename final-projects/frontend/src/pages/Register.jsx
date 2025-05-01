import React, { useState } from "react";
import authService from "../services/authService";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authService.register({ username, email, password });
      window.location.href = "/login";
    } catch (err) {
      setError("Registration failed. Please check your information.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#010B1D] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(#0A4B94 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Left Section with Animated Lock Icon */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="w-[500px] h-[500px] relative flex items-center justify-center">
          {/* Glow Effects */}
          <div className="absolute inset-0 blur-[100px] bg-gradient-to-br from-[#0066FF]/30 to-[#00FF00]/20 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 blur-[50px] bg-gradient-to-tr from-[#0066FF]/20 to-transparent rounded-full"></div>

          {/* Main Lock Icon */}
          <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
            <svg
              className="w-64 h-64 text-[#0066FF]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C9.23858 2 7 4.23858 7 7V9H8.5V7C8.5 5.067 10.067 3.5 12 3.5C13.933 3.5 15.5 5.067 15.5 7V9H17V7C17 4.23858 14.7614 2 12 2Z"
                fill="currentColor"
              />
              <path
                d="M4 12C4 10.8954 4.89543 10 6 10H18C19.1046 10 20 10.8954 20 12V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V12Z"
                fill="currentColor"
              />
              <circle cx="12" cy="15.5" r="1.5" fill="#010B1D" />
              <path
                d="M12 15.5V18"
                stroke="#010B1D"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#0066FF] rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-[#00FF00] rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Right Section with Register Form */}
      <div className="flex-1 flex items-center justify-center pr-32">
        <div className="w-[380px] bg-[#010B1D]/95 backdrop-blur-lg rounded-3xl p-8 border border-[#0066FF]/10">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#0066FF]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-2.93 8.87-7 10.13V3.18z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#010B1D] border border-[#0066FF]/20 text-white placeholder-gray-500
              focus:outline-none focus:border-[#0066FF] transition-colors"
              placeholder="Username"
              required
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#010B1D] border border-[#0066FF]/20 text-white placeholder-gray-500
              focus:outline-none focus:border-[#0066FF] transition-colors"
              placeholder="Email"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#010B1D] border border-[#0066FF]/20 text-white placeholder-gray-500
              focus:outline-none focus:border-[#0066FF] transition-colors"
              placeholder="Password"
              required
            />

            <button
              type="submit"
              className="w-full py-3 bg-[#0066FF] text-white rounded-lg font-medium hover:bg-[#0055DD] transition-colors"
            >
              Register
            </button>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#0066FF] hover:text-[#0055DD]"
              >
                Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
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

      <div className="flex-1 flex items-center justify-center">
        <div className="w-[500px] h-[500px] relative">
          <div className="absolute inset-0 blur-[100px] bg-[#0066FF] opacity-20 rounded-full"></div>
          <svg className="w-full h-full text-[#0066FF] opacity-90" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-1/2 h-1/2 text-[#0066FF] opacity-90" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center pr-32">
        <div className="w-[380px] bg-[#010B1D]/95 backdrop-blur-lg rounded-3xl p-8 border border-[#0066FF]/10">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#0066FF]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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
              placeholder="Email address"
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
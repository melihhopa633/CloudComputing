import React, { useState } from "react";
import authService from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authService.login(email, password);
      // Redirect on successful login - replace with your routing logic if using a router
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid email or password. Please try again."); // More specific error
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#010B1D] to-[#041331] relative overflow-hidden">
      {/* Connected Dots Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(#0A4B94 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      ></div>

      {/* Left Section with Glowing Shield Logo */}      <div className="flex-1 flex items-center justify-center relative">
        <div className="w-[400px] h-[400px] relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 blur-[80px] bg-[#0A4B94] opacity-20 rounded-full"></div>
          
          {/* Main Shield */}
          <svg className="w-full h-full text-[#0A4B94] relative z-10 drop-shadow-[0_0_20px_rgba(10,75,148,0.3)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-2.93 8.87-7 10.13V3.18z"/>
          </svg>
          
          {/* Centered Lock Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-1/2 h-1/2 text-[#0A4B94] drop-shadow-[0_0_10px_rgba(10,75,148,0.5)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Right Section with Login Card */}      <div className="w-[450px] min-h-screen bg-[#041331]/80 backdrop-blur-md flex items-center justify-center px-16 relative">
        {/* Glass effect border */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        
        <div className="w-full space-y-4 relative py-6">
          {/* Shield Icon with glow */}
          <div className="flex justify-center mb-1">
            <div className="w-10 h-10 flex items-center justify-center relative">
              <div className="absolute inset-0 blur-[15px] bg-[#0A4B94] opacity-30 rounded-full"></div>
              <svg className="w-6 h-6 text-[#0A4B94] relative z-10 drop-shadow-[0_0_8px_rgba(10,75,148,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-white tracking-wide mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              {/* Email Input */}
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#041331]/80 border border-[#0A4B94]/50 text-white placeholder-gray-400 focus:outline-none focus:border-[#0A4B94] focus:ring-1 focus:ring-[#0A4B94] transition-all duration-200"
                placeholder="Enter your email"
                autoComplete="username"
              />

              {/* Password Input */}
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#041331]/80 border border-[#0A4B94]/50 text-white placeholder-gray-400 focus:outline-none focus:border-[#0A4B94] focus:ring-1 focus:ring-[#0A4B94] transition-all duration-200"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {/* Login Button with glow effect */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#0A4B94] text-white font-medium relative overflow-hidden group transition-all duration-300 mt-2"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0A4B94] to-[#1a5ca5] group-hover:scale-105 transition-transform duration-300"></div>
              <span className="relative z-10">Login</span>
            </button>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-400 mt-4">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-[#0A4B94] hover:text-[#1a5ca5] transition-colors font-medium"
              >
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;



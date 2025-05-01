import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Direkt olarak dashboard'a yönlendir
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-[#010B1D] relative overflow-hidden">
      {/* Background dots */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(#0A4B94 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      ></div>

      {/* Left Section with Shield */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-[500px] h-[500px] relative">
          <div className="absolute inset-0 blur-[100px] bg-[#0066FF] opacity-20 rounded-full"></div>
          <svg className="w-full h-full text-[#0066FF] opacity-90" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-2.93 8.87-7 10.13V3.18z"/>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-1/2 h-1/2 text-[#0066FF] opacity-90" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center pr-32">
        <div className="w-[380px] bg-[#010B1D]/95 backdrop-blur-lg rounded-3xl p-8 border border-[#0066FF]/10">
          {/* Login Form Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#0066FF]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-2.93 8.87-7 10.13V3.18z"/>
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-8">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#010B1D] border border-[#0066FF]/20 text-white placeholder-gray-500
              focus:outline-none focus:border-[#0066FF] transition-colors"
              placeholder="abc_123@gmail.com"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#010B1D] border border-[#0066FF]/20 text-white placeholder-gray-500
              focus:outline-none focus:border-[#0066FF] transition-colors"
              placeholder="••••••"
            />            <button
              type="submit"
              className="w-full py-3 bg-[#0066FF] text-white rounded-lg font-medium hover:bg-[#0055DD] transition-colors"
            >
              Login
            </button>            <div className="text-center text-sm text-gray-400">
              Don't have an account? <Link to="/register" className="text-[#0066FF] hover:text-[#0055DD]">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;



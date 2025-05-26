import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const CloudBlockchainIcon = () => (
  <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6">
    <defs>
      <linearGradient id="cloudGlow" x1="0" y1="0" x2="0" y2="1" gradientTransform="rotate(90)">
        <stop stopColor="#00BFFF" />
        <stop offset="1" stopColor="#0066FF" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Cloud outline */}
    <path d="M30 60 Q20 40 40 30 Q50 10 70 20 Q90 10 100 30 Q120 40 110 60 Q120 80 90 80 Q70 100 50 80 Q20 80 30 60 Z" stroke="url(#cloudGlow)" strokeWidth="3.5" fill="none" filter="url(#glow)" />
    {/* Blockchain cubes - tam ortada */}
    <g filter="url(#glow)" transform="translate(0, 8)">
      {/* Center cube */}
      <g>
        <polygon points="60,38 68,42 60,46 52,42" fill="#0a192f" stroke="#00BFFF" strokeWidth="2" />
        <polygon points="60,38 68,42 68,50 60,54 52,50 52,42" fill="#112240" stroke="#00BFFF" strokeWidth="2" />
        <polygon points="68,42 68,50 60,54 60,46" fill="#1e3a8a" stroke="#00BFFF" strokeWidth="2" />
      </g>
      {/* Left cube */}
      <g transform="translate(-16, 14)">
        <polygon points="60,38 68,42 60,46 52,42" fill="#0a192f" stroke="#00BFFF" strokeWidth="2" />
        <polygon points="60,38 68,42 68,50 60,54 52,50 52,42" fill="#112240" stroke="#00BFFF" strokeWidth="2" />
        <polygon points="68,42 68,50 60,54 60,46" fill="#1e3a8a" stroke="#00BFFF" strokeWidth="2" />
      </g>
      {/* Right cube */}
      <g transform="translate(16, 14)">
        <polygon points="60,38 68,42 60,46 52,42" fill="#0a192f" stroke="#00BFFF" strokeWidth="2" />
        <polygon points="60,38 68,42 68,50 60,54 52,50 52,42" fill="#112240" stroke="#00BFFF" strokeWidth="2" />
        <polygon points="68,42 68,50 60,54 60,46" fill="#1e3a8a" stroke="#00BFFF" strokeWidth="2" />
      </g>
      {/* Connecting lines */}
      <line x1="60" y1="54" x2="44" y2="58" stroke="#00BFFF" strokeWidth="2" />
      <line x1="60" y1="54" x2="76" y2="58" stroke="#00BFFF" strokeWidth="2" />
      <line x1="60" y1="54" x2="60" y2="70" stroke="#00BFFF" strokeWidth="2" />
      {/* Bottom node */}
      <circle cx="60" cy="70" r="4" fill="#0a192f" stroke="#00BFFF" strokeWidth="2" />
    </g>
    {/* WiFi lines */}
    <path d="M60 18 Q65 14 70 18" stroke="#00BFFF" strokeWidth="2" fill="none" />
    <path d="M55 13 Q60 8 65 13" stroke="#00BFFF" strokeWidth="2" fill="none" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await authService.login(email, password);
      if (response.token) {
        // Roles are now stored in localStorage by authService
        // Redirect based on role
        if (authService.isAdmin()) {
          navigate("/dashboard"); // Admin sees everything
        } else {
          navigate("/tasks"); // Regular users only see tasks
        }
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0a192f] to-black font-['Inter','Poppins',sans-serif]">
      <div className="backdrop-blur-lg bg-[#112240]/60 rounded-2xl shadow-2xl px-8 py-10 w-full max-w-md flex flex-col items-center border border-[#1e3a8a]/40">
        <CloudBlockchainIcon />
        <h1 className="text-2xl md:text-3xl font-bold text-[#00BFFF] text-center mb-2 drop-shadow-[0_0_8px_#00BFFF]">Welcome to</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-[#00BFFF] text-center mb-8 drop-shadow-[0_0_8px_#00BFFF]">DecentraCloud</h2>
        <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00BFFF]">
              {/* User icon */}
              <svg width="20" height="20" fill="none" stroke="#00BFFF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>
            </span>
            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#112240] text-white placeholder:text-[#7dd3fc] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] border border-transparent focus:border-[#00BFFF] transition-all duration-200 shadow-md" />
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00BFFF]">
              {/* Key icon */}
              <svg width="20" height="20" fill="none" stroke="#00BFFF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="15" cy="15" r="4" /><path d="M15 11v-1a4 4 0 1 0-8 0v1" /><path d="M7 15h8" /></svg>
            </span>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#112240] text-white placeholder:text-[#7dd3fc] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] border border-transparent focus:border-[#00BFFF] transition-all duration-200 shadow-md" />
          </div>
          <button type="submit" className="mt-2 w-full py-3 rounded-lg bg-gradient-to-r from-[#00BFFF] to-[#0066FF] text-white font-bold text-lg shadow-lg hover:from-[#0099cc] hover:to-[#0055cc] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-all duration-200 drop-shadow-[0_0_12px_#00BFFF]">LOGIN</button>
          {error && <div className="text-red-400 text-sm text-center mt-2">{error}</div>}
        </form>
        <div className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-[#00BFFF] hover:underline font-semibold">Sign up</a>
        </div>
      </div>
    </div>
  );
}

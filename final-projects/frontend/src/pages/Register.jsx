import React, { useState } from "react";
import authService from "../services/authService";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authService.register({ FullName: fullName, Email: email, Password: password });
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
        <div className="w-[720px] h-[720px] flex items-center justify-center">
          <svg width="600" height="600" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#00BFFF" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#05CA82" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0066FF" stopOpacity="0.1" />
              </radialGradient>
              <linearGradient id="nodeGradient" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#00BFFF" />
                <stop offset="1" stopColor="#05CA82" />
              </linearGradient>
              <linearGradient id="cubeGradient" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#0a192f" />
                <stop offset="1" stopColor="#112240" />
              </linearGradient>
              <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Background glow */}
            <circle cx="140" cy="140" r="120" fill="url(#centerGlow)" opacity="0.3" />
            
            {/* Central blockchain network */}
            <g transform="translate(140, 140)">
              {/* Center node - main blockchain cube */}
              <g filter="url(#nodeGlow)">
                <polygon points="0,-12 12,-6 0,0 -12,-6" fill="url(#cubeGradient)" stroke="#00BFFF" strokeWidth="2.5" />
                <polygon points="0,-12 12,-6 12,6 0,12 -12,6 -12,-6" fill="#112240" stroke="#00BFFF" strokeWidth="2.5" />
                <polygon points="12,-6 12,6 0,12 0,0" fill="#1e3a8a" stroke="#00BFFF" strokeWidth="2.5" />
              </g>
              
              {/* Surrounding nodes in a circle */}
              {Array.from({ length: 8 }, (_, i) => {
                const angle = (i * 45) * Math.PI / 180;
                const radius = 60;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <g key={i} transform={`translate(${x}, ${y})`}>
                    <circle r="8" fill="url(#nodeGradient)" stroke="#fff" strokeWidth="2" filter="url(#nodeGlow)" />
                    <circle r="4" fill="#fff" opacity="0.8" />
                    {/* Connection lines to center */}
                    <line x1="0" y1="0" x2={-x * 0.7} y2={-y * 0.7} stroke="#00BFFF" strokeWidth="2" opacity="0.6" />
                  </g>
                );
              })}
              
              {/* Outer ring of smaller nodes */}
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i * 30) * Math.PI / 180;
                const radius = 100;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="#05CA82" stroke="#fff" strokeWidth="1.5" filter="url(#nodeGlow)" />
                    {/* Connecting lines between outer nodes */}
                    {i % 3 === 0 && (
                      <line 
                        x1={x} 
                        y1={y} 
                        x2={Math.cos(((i + 3) * 30) * Math.PI / 180) * radius} 
                        y2={Math.sin(((i + 3) * 30) * Math.PI / 180) * radius} 
                        stroke="#05CA82" 
                        strokeWidth="1.5" 
                        opacity="0.4" 
                      />
                    )}
                  </g>
                );
              })}
            </g>
            
            {/* Floating data particles */}
            <g opacity="0.7">
              <circle cx="50" cy="80" r="2" fill="#00BFFF">
                <animate attributeName="cy" values="80;60;80" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="230" cy="100" r="1.5" fill="#05CA82">
                <animate attributeName="cy" values="100;120;100" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="70" cy="200" r="2.5" fill="#00BFFF">
                <animate attributeName="cx" values="70;90;70" dur="5s" repeatCount="indefinite" />
              </circle>
              <circle cx="210" cy="220" r="2" fill="#05CA82">
                <animate attributeName="cx" values="210;190;210" dur="3.5s" repeatCount="indefinite" />
              </circle>
            </g>
            
            {/* Cloud computing elements */}
            <g transform="translate(140, 50)" opacity="0.6">
              <path d="M-30,0 Q-40,-15 -20,-20 Q-10,-35 10,-25 Q30,-35 40,-20 Q60,-15 50,0 Q60,15 30,20 Q10,35 -10,25 Q-40,15 -30,0 Z" 
                    stroke="#00BFFF" strokeWidth="2" fill="none" filter="url(#nodeGlow)" />
              <text x="0" y="5" textAnchor="middle" fill="#00BFFF" fontSize="12" fontWeight="bold">CLOUD</text>
            </g>
            
            {/* Blockchain text */}
            <g transform="translate(140, 230)" opacity="0.6">
              <rect x="-35" y="-8" width="70" height="16" rx="8" stroke="#05CA82" strokeWidth="2" fill="none" filter="url(#nodeGlow)" />
              <text x="0" y="4" textAnchor="middle" fill="#05CA82" fontSize="11" fontWeight="bold">BLOCKCHAIN</text>
            </g>
          </svg>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center pr-32">
        <div className="w-[480px] bg-[#010B1D]/95 backdrop-blur-lg rounded-3xl p-12 border border-[#0066FF]/10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[#0066FF]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-[#010B1D] border border-[#0066FF]/20 text-white placeholder-gray-500
              focus:outline-none focus:border-[#0066FF] transition-colors"
              placeholder="Full Name"
              required
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-[#010B1D] border border-[#0066FF]/20 text-white placeholder-gray-500
              focus:outline-none focus:border-[#0066FF] transition-colors"
              placeholder="Email address"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-[#010B1D] border border-[#0066FF]/20 text-white placeholder-gray-500
              focus:outline-none focus:border-[#0066FF] transition-colors"
              placeholder="Password"
              required
            />

            <button
              type="submit"
              className="w-full py-4 text-lg bg-[#0066FF] text-white rounded-lg font-medium hover:bg-[#0055DD] transition-colors"
            >
              Register
            </button>

            {error && (
              <div className="text-red-400 text-base text-center">{error}</div>
            )}

            <div className="text-center text-base text-gray-400">
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
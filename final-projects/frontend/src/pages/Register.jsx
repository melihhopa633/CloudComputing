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
        <div className="w-[340px] h-[340px] flex items-center justify-center">
          <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="cloudGlow2" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#00BFFF" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0066FF" stopOpacity="0.2" />
              </radialGradient>
              <linearGradient id="userGradient2" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#00BFFF" />
                <stop offset="1" stopColor="#05CA82" />
              </linearGradient>
              <linearGradient id="chipGradient" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#fff" />
                <stop offset="1" stopColor="#00BFFF" />
              </linearGradient>
            </defs>
            <ellipse cx="120" cy="190" rx="90" ry="28" fill="url(#cloudGlow2)" />
            <circle cx="120" cy="90" r="44" fill="url(#userGradient2)" stroke="#fff" strokeWidth="5" />
            <ellipse cx="120" cy="150" rx="38" ry="18" fill="#fff" fillOpacity="0.8" />
            <rect x="105" y="140" width="30" height="18" rx="5" fill="url(#chipGradient)" stroke="#00BFFF" strokeWidth="2" />
            <line x1="120" y1="158" x2="120" y2="170" stroke="#00BFFF" strokeWidth="2" />
            <line x1="112" y1="158" x2="108" y2="168" stroke="#00BFFF" strokeWidth="1.5" />
            <line x1="128" y1="158" x2="132" y2="168" stroke="#00BFFF" strokeWidth="1.5" />
            <path d="M60 200 Q80 180 120 200 Q160 220 180 200" stroke="#05CA82" strokeWidth="2.5" fill="none" />
            <g>
              <rect x="40" y="60" width="18" height="18" rx="4" fill="#0a192f" stroke="#00BFFF" strokeWidth="2" />
              <rect x="182" y="70" width="16" height="16" rx="4" fill="#0a192f" stroke="#05CA82" strokeWidth="2" />
              <rect x="60" y="30" width="14" height="14" rx="3" fill="#112240" stroke="#00BFFF" strokeWidth="1.5" />
              <rect x="170" y="40" width="12" height="12" rx="3" fill="#112240" stroke="#05CA82" strokeWidth="1.5" />
            </g>
            <circle cx="60" cy="120" r="3" fill="#05CA82" />
            <circle cx="180" cy="120" r="2.5" fill="#00BFFF" />
            <circle cx="90" cy="60" r="2" fill="#05CA82" />
            <circle cx="150" cy="50" r="2.5" fill="#00BFFF" />
            <circle cx="200" cy="180" r="2" fill="#05CA82" />
            <circle cx="40" cy="180" r="2" fill="#00BFFF" />
          </svg>
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#010B1D] border border-[#0066FF]/20 text-white placeholder-gray-500
              focus:outline-none focus:border-[#0066FF] transition-colors"
              placeholder="Full Name"
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
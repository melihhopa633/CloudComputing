import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

// Küçük logo (form içinde kullanılacak)
const CloudBlockchainIcon = () => (
  <svg width="80" height="70" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
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

// Sağ taraftaki profesyonel blockchain ağı animasyonu
const AnimatedBlockchainIcon = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg width="520" height="420" viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
      <defs>
        <linearGradient id="blockGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00BFFF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>
        <filter id="blockGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00BFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#00BFFF" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Blokların koordinatları */}
      {/**
       * 0: (60,80)   1: (60,200)   2: (60,320)
       * 3: (140,60)  4: (140,140)  5: (140,220)
       * 6: (220,140) 7: (220,300)
       * 8: (260,60)  9: (260,200) 10: (260,340)
       * 11: (380,80) 12: (380,200) 13: (380,320)
       * 14: (460,60) 15: (460,140) 16: (460,220)
       */}
      {/* Bağlantı çizgileri - Her kutu en az 4 farklı kutuya bağlı */}
      <g>
        {/* 0 */}
        <AnimatedLine x1={60} y1={80} x2={140} y2={60} delay={0} />
        <AnimatedLine x1={60} y1={80} x2={60} y2={200} delay={0.1} />
        <AnimatedLine x1={60} y1={80} x2={140} y2={140} delay={0.2} />
        <AnimatedLine x1={60} y1={80} x2={220} y2={140} delay={0.3} />
        {/* 1 */}
        <AnimatedLine x1={60} y1={200} x2={60} y2={320} delay={0.4} />
        <AnimatedLine x1={60} y1={200} x2={140} y2={140} delay={0.5} />
        <AnimatedLine x1={60} y1={200} x2={140} y2={220} delay={0.6} />
        <AnimatedLine x1={60} y1={200} x2={220} y2={140} delay={0.7} />
        {/* 2 */}
        <AnimatedLine x1={60} y1={320} x2={140} y2={220} delay={0.8} />
        <AnimatedLine x1={60} y1={320} x2={220} y2={300} delay={0.9} />
        <AnimatedLine x1={60} y1={320} x2={140} y2={140} delay={1.0} />
        <AnimatedLine x1={60} y1={320} x2={220} y2={140} delay={1.1} />
        {/* 3 */}
        <AnimatedLine x1={140} y1={60} x2={140} y2={140} delay={1.2} />
        <AnimatedLine x1={140} y1={60} x2={220} y2={140} delay={1.3} />
        <AnimatedLine x1={140} y1={60} x2={260} y2={60} delay={1.4} />
        <AnimatedLine x1={140} y1={60} x2={220} y2={300} delay={1.5} />
        {/* 4 */}
        <AnimatedLine x1={140} y1={140} x2={140} y2={220} delay={1.6} />
        <AnimatedLine x1={140} y1={140} x2={220} y2={140} delay={1.7} />
        <AnimatedLine x1={140} y1={140} x2={220} y2={300} delay={1.8} />
        {/* 5 */}
        <AnimatedLine x1={140} y1={220} x2={220} y2={300} delay={1.9} />
        <AnimatedLine x1={140} y1={220} x2={220} y2={140} delay={2.0} />
        <AnimatedLine x1={140} y1={220} x2={260} y2={200} delay={2.1} />
        <AnimatedLine x1={140} y1={220} x2={220} y2={300} delay={2.2} />
        {/* 6 */}
        <AnimatedLine x1={220} y1={140} x2={220} y2={300} delay={2.3} />
        <AnimatedLine x1={220} y1={140} x2={260} y2={60} delay={2.4} />
        <AnimatedLine x1={220} y1={140} x2={260} y2={200} delay={2.5} />
        <AnimatedLine x1={220} y1={140} x2={380} y2={80} delay={2.6} />
        {/* 7 */}
        <AnimatedLine x1={220} y1={300} x2={260} y2={340} delay={2.7} />
        <AnimatedLine x1={220} y1={300} x2={260} y2={200} delay={2.8} />
        <AnimatedLine x1={220} y1={300} x2={380} y2={320} delay={2.9} />
        <AnimatedLine x1={220} y1={300} x2={380} y2={200} delay={3.0} />
        {/* 8 */}
        <AnimatedLine x1={260} y1={60} x2={380} y2={80} delay={3.1} />
        <AnimatedLine x1={260} y1={60} x2={260} y2={200} delay={3.2} />
        <AnimatedLine x1={260} y1={60} x2={380} y2={200} delay={3.3} />
        <AnimatedLine x1={260} y1={60} x2={460} y2={60} delay={3.4} />
        {/* 9 */}
        <AnimatedLine x1={260} y1={200} x2={380} y2={200} delay={3.5} />
        <AnimatedLine x1={260} y1={200} x2={260} y2={340} delay={3.6} />
        <AnimatedLine x1={260} y1={200} x2={380} y2={320} delay={3.7} />
        <AnimatedLine x1={260} y1={200} x2={460} y2={140} delay={3.8} />
        {/* 10 */}
        <AnimatedLine x1={260} y1={340} x2={380} y2={320} delay={3.9} />
        <AnimatedLine x1={260} y1={340} x2={460} y2={220} delay={4.0} />
        <AnimatedLine x1={260} y1={340} x2={380} y2={200} delay={4.1} />
        <AnimatedLine x1={260} y1={340} x2={460} y2={220} delay={4.2} />
        {/* 11 */}
        <AnimatedLine x1={380} y1={80} x2={460} y2={60} delay={4.3} />
        <AnimatedLine x1={380} y1={80} x2={380} y2={200} delay={4.4} />
        <AnimatedLine x1={380} y1={80} x2={460} y2={140} delay={4.5} />
        <AnimatedLine x1={380} y1={80} x2={380} y2={320} delay={4.6} />
        {/* 12 */}
        <AnimatedLine x1={380} y1={200} x2={460} y2={140} delay={4.7} />
        <AnimatedLine x1={380} y1={200} x2={460} y2={220} delay={4.8} />
        <AnimatedLine x1={380} y1={200} x2={380} y2={320} delay={4.9} />
        <AnimatedLine x1={380} y1={200} x2={460} y2={60} delay={5.0} />
        {/* 13 */}
        <AnimatedLine x1={380} y1={320} x2={460} y2={220} delay={5.1} />
        <AnimatedLine x1={380} y1={320} x2={460} y2={140} delay={5.2} />
        <AnimatedLine x1={380} y1={320} x2={460} y2={60} delay={5.3} />
        <AnimatedLine x1={380} y1={320} x2={260} y2={340} delay={5.4} />
        {/* 14 */}
        <AnimatedLine x1={460} y1={60} x2={460} y2={140} delay={5.5} />
        <AnimatedLine x1={460} y1={60} x2={460} y2={220} delay={5.6} />
        <AnimatedLine x1={460} y1={60} x2={380} y2={200} delay={5.7} />
        <AnimatedLine x1={460} y1={60} x2={380} y2={320} delay={5.8} />
        {/* 15 */}
        <AnimatedLine x1={460} y1={140} x2={460} y2={220} delay={5.9} />
        <AnimatedLine x1={460} y1={140} x2={380} y2={320} delay={6.0} />
        <AnimatedLine x1={460} y1={140} x2={380} y2={80} delay={6.1} />
        <AnimatedLine x1={460} y1={140} x2={260} y2={200} delay={6.2} />
        {/* 16 */}
        <AnimatedLine x1={460} y1={220} x2={380} y2={320} delay={6.3} />
        <AnimatedLine x1={460} y1={220} x2={260} y2={340} delay={6.4} />
        <AnimatedLine x1={460} y1={220} x2={380} y2={200} delay={6.5} />
        <AnimatedLine x1={460} y1={220} x2={260} y2={200} delay={6.6} />
      </g>
      {/* Bloklar (kutular) */}
      {/* Sol bloklar */}
      <Block x={60} y={80} glow />
      <Block x={60} y={200} />
      <Block x={60} y={320} />
      <Block x={140} y={60} />
      <Block x={140} y={140} glow />
      <Block x={140} y={220} />
      {/* Merkez bloklar */}
      <Block x={220} y={140} />
      <Block x={220} y={300} />
      <Block x={260} y={60} glow />
      <Block x={260} y={200} glow />
      <Block x={260} y={340} />
      {/* Sağ bloklar */}
      <Block x={380} y={80} />
      <Block x={380} y={200} glow />
      <Block x={380} y={320} />
      <Block x={460} y={60} />
      <Block x={460} y={140} />
      <Block x={460} y={220} />
    </svg>
    {/* Hafif arka plan blur ve mavi daire */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="rounded-full bg-gradient-to-br from-[#0a192f]/60 to-[#0066FF]/30 blur-2xl w-[420px] h-[340px]" />
    </div>
  </div>
);

// Blok (kutu) komponenti
const Block = ({ x, y, glow }) => (
  <g>
    <rect
      x={x - 24}
      y={y - 24}
      width={48}
      height={48}
      rx={12}
      fill="url(#blockGradient)"
      filter={glow ? 'url(#blockGlow)' : ''}
      stroke="#00BFFF"
      strokeWidth="2.5"
      style={{ transition: 'filter 0.3s' }}
    />
    {/* Parlayan animasyon efekti */}
    <animate
      attributeName="opacity"
      values="0.85;1;0.85"
      dur="2.5s"
      repeatCount="indefinite"
      begin={Math.random() * 1.5 + 's'}
    />
  </g>
);

// Bağlantı çizgisi komponenti (animasyonlu gradient stroke)
const AnimatedLine = ({ x1, y1, x2, y2, delay }) => (
  <g>
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="url(#lineGradient)"
      strokeWidth="4"
      strokeDasharray="8 8"
      strokeLinecap="round"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="0;16"
        dur="1.2s"
        repeatCount="indefinite"
        begin={delay + 's'}
      />
    </line>
  </g>
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
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl">
        {/* Sol taraf - Login formu */}
        <div className="w-full md:w-1/2 flex justify-center">
      <div className="backdrop-blur-lg bg-[#112240]/60 rounded-2xl shadow-2xl px-8 py-10 w-full max-w-md flex flex-col items-center border border-[#1e3a8a]/40">
        <CloudBlockchainIcon />
            <h1 className="text-xl md:text-2xl font-bold text-[#00BFFF] text-center mb-1 drop-shadow-[0_0_8px_#00BFFF]">Welcome to</h1>
            <h2 className="text-xl md:text-2xl font-bold text-[#00BFFF] text-center mb-6 drop-shadow-[0_0_8px_#00BFFF]">DecentraCloud</h2>
        <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
          <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00BFFF]">
              {/* User icon */}
                  <svg width="24" height="24" fill="none" stroke="#00BFFF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>
            </span>
                <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-3 py-3 rounded-lg bg-[#112240] text-white placeholder:text-[#7dd3fc] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] border border-transparent focus:border-[#00BFFF] transition-all duration-200 shadow-md text-lg" />
          </div>
          <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00BFFF]">
              {/* Key icon */}
                  <svg width="24" height="24" fill="none" stroke="#00BFFF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="15" cy="15" r="4" /><path d="M15 11v-1a4 4 0 1 0-8 0v1" /><path d="M7 15h8" /></svg>
            </span>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-3 py-3 rounded-lg bg-[#112240] text-white placeholder:text-[#7dd3fc] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] border border-transparent focus:border-[#00BFFF] transition-all duration-200 shadow-md text-lg" />
          </div>
              <button type="submit" className="mt-2 w-full py-3 rounded-lg bg-gradient-to-r from-[#00BFFF] to-[#0066FF] text-white font-bold text-xl shadow-lg hover:from-[#0099cc] hover:to-[#0055cc] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-all duration-200 drop-shadow-[0_0_12px_#00BFFF]">LOGIN</button>
              {error && <div className="text-red-400 text-base text-center mt-2">{error}</div>}
        </form>
            <div className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-[#00BFFF] hover:underline font-semibold">Sign up</a>
            </div>
          </div>
        </div>
        
        {/* Sağ taraf - Animasyonlu blockchain ikonu */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative w-full max-w-xl h-[500px]">
            <AnimatedBlockchainIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

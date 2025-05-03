import React from "react";

const CloudBlockchainIcon = () => (
   <svg width="140" height="120" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
         <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="#1ec8ff" />
            <stop offset="100%" stopColor="#007cf0" />
         </linearGradient>
      </defs>
      <path d="M35 80C15 80 10 40 45 35C50 10 90 10 95 35C130 40 125 80 105 80H35Z" stroke="url(#cloudGradient)" strokeWidth="4" fill="none" />
      <g stroke="url(#cloudGradient)" strokeWidth="3">
         <rect x="65" y="38" width="18" height="18" rx="3" />
         <rect x="45" y="60" width="18" height="18" rx="3" />
         <rect x="85" y="60" width="18" height="18" rx="3" />
         <line x1="74" y1="56" x2="54" y2="66" />
         <line x1="82" y1="56" x2="102" y2="66" />
         <line x1="74" y1="56" x2="74" y2="78" />
         <line x1="82" y1="56" x2="82" y2="78" />
      </g>
      <path d="M70 22C75 18 85 18 90 22" stroke="url(#cloudGradient)" strokeWidth="3" strokeLinecap="round" />
      <path d="M66 16C72 12 88 12 94 16" stroke="url(#cloudGradient)" strokeWidth="2" strokeLinecap="round" />
   </svg>
);

const Login = () => {
   return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a192f] to-black font-[Inter,sans-serif]">
         <div className="flex flex-col items-center w-full max-w-md px-6 py-10 bg-black/40 rounded-2xl shadow-2xl backdrop-blur-md">
            <div className="mb-6 flex flex-col items-center">
               <CloudBlockchainIcon />
               <h1 className="mt-6 text-2xl md:text-3xl font-bold text-cyan-300 text-center drop-shadow-lg">Welcome to</h1>
               <h2 className="text-3xl md:text-4xl font-extrabold text-cyan-400 text-center tracking-wide mb-2 drop-shadow-lg">DecentraCloud</h2>
            </div>
            <form className="w-full flex flex-col gap-5">
               <div className="relative">
                  <input
                     type="text"
                     placeholder="Username"
                     className="w-full py-3 pl-12 pr-4 bg-[#0a192f]/80 text-cyan-100 rounded-2xl outline-none border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/60 shadow-md transition-all duration-200 placeholder-cyan-400/70"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">
                     <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" /></svg>
                  </span>
               </div>
               <div className="relative">
                  <input
                     type="password"
                     placeholder="Password"
                     className="w-full py-3 pl-12 pr-4 bg-[#0a192f]/80 text-cyan-100 rounded-2xl outline-none border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/60 shadow-md transition-all duration-200 placeholder-cyan-400/70"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">
                     <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-2V9a6 6 0 1 0-12 0v6m16 0a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2" /></svg>
                  </span>
               </div>
               <button
                  type="submit"
                  className="mt-2 w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:from-cyan-300 hover:to-blue-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/60 transition-all duration-200 neon-glow"
               >
                  LOGIN
               </button>
            </form>

         </div>
         <style>{`
        .neon-glow {
          box-shadow: 0 0 16px 2px #1ec8ff99, 0 2px 8px 0 #000a;
        }
      `}</style>
      </div>
   );
};

export default Login; 
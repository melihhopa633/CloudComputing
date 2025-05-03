import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { username, password });
    // Handle login logic here
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-navy-blue">
      <div className="w-full max-w-md">
        {/* Cloud with Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Main Cloud */}
            <div className="w-64 h-64 bg-cloud-white rounded-full flex items-center justify-center">
              {/* Cube network inside cloud */}
              <div className="w-28 h-28 bg-navy-blue rounded-full flex items-center justify-center">
                <div className="relative">
                  {/* Top cube */}
                  <div className="absolute h-8 w-8 border-2 border-white left-1/2 -ml-4 -mt-10 transform rotate-45"></div>
                  
                  {/* Bottom left cube */}
                  <div className="absolute h-8 w-8 border-2 border-white -left-8 top-2 transform rotate-45"></div>
                  
                  {/* Bottom right cube */}
                  <div className="absolute h-8 w-8 border-2 border-white left-8 top-2 transform rotate-45"></div>
                  
                  {/* Lines connecting cubes */}
                  <div className="absolute h-0.5 w-7 bg-white left-1/2 -top-4 -ml-3.5"></div>
                  <div className="absolute h-0.5 w-7 bg-white -left-4 top-4 rotate-45"></div>
                  <div className="absolute h-0.5 w-7 bg-white left-2 top-4 -rotate-45"></div>
                </div>
              </div>
            </div>
            
            {/* External Cubes */}
            <div className="absolute h-8 w-8 bg-gray-300 transform rotate-45 -left-10 top-12"></div>
            <div className="absolute h-8 w-8 bg-gray-300 transform rotate-45 -bottom-4 -left-24"></div>
            <div className="absolute h-8 w-8 bg-gray-300 transform rotate-45 right-0 top-1/2"></div>
            
            {/* Dotted lines connecting external cubes */}
            <div className="absolute w-20 h-0.5 border-t-2 border-dashed border-blue-300 -left-24 top-12 transform rotate-45"></div>
            <div className="absolute w-20 h-0.5 border-t-2 border-dashed border-blue-300 -left-10 top-28 transform -rotate-45"></div>
            <div className="absolute w-20 h-0.5 border-t-2 border-dashed border-blue-300 left-36 top-32 transform -rotate-45"></div>
          </div>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="px-6">
          {/* Username Input */}
          <div className="mb-4 relative">
            <div className="flex items-center bg-dark-blue rounded-full overflow-hidden">
              <div className="px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full py-3 px-4 bg-dark-blue text-white focus:outline-none"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          {/* Password Input */}
          <div className="mb-6 relative">
            <div className="flex items-center bg-dark-blue rounded-full overflow-hidden">
              <div className="px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                className="w-full py-3 px-4 bg-dark-blue text-white focus:outline-none"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-full text-xl font-bold mb-10"
          >
            LOG IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 
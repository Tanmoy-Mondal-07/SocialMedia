import React, { useEffect, useState } from 'react';
import logo from './assets/logo01.svg'

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 15;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .glitch-effect {
            position: relative;
            color: white;
          }
          .glitch-effect::before,
          .glitch-effect::after {
            content: attr(data-text);
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            overflow: hidden;
            color: neonpink;
            clip: rect(0, 0, 0, 0);
          }
        `}
      </style>

      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <div className="fixed inset-0 bg-gray-800 bg-repeat opacity-10"></div>
        <div className="fixed inset-0 bg-gray-700 bg-repeat opacity-5"></div>

        <div className="flex flex-col items-center animate-fade-in">
          <img 
            src={logo} 
            alt="Phoenix Logo"
            className="w-24 h-24 mb-6 animate-float" 
          />

          <div className="w-64 h-1 bg-gray-900 relative mb-2 overflow-hidden">
            <div
              className="h-full bg-red-950 transition-all duration-200 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="font-bold text-lg text-white">
            {Math.round(progress)}%
          </div>

          {/* <div className="mt-4 text-2xl glitch-effect" data-text="SYSTEM INITIALIZING">
            SYSTEM INITIALIZING
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Loader;
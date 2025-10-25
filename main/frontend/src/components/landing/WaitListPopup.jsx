import React from "react";

const WaitlistPopup = ({ onYes, onNo }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-out] px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl text-center max-w-md w-full transform animate-[slideUp_0.4s_ease-out] relative overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f15b28]/5 via-transparent to-[#0D1539]/5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f15b28] to-[#ff7a4d] rounded-full flex items-center justify-center shadow-lg">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path 
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold mb-3 text-[#0D1539]">
            Join the Waitlist
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-8">
            Be the first to discover emerging brands.<br />
            <span className="text-sm text-gray-500">No spam, important updates only.</span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={onYes}
              className="group bg-gradient-to-r from-[#f15b28] to-[#ff7a4d] text-white font-semibold px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-[#ff7a4d] hover:to-[#f15b28] flex items-center justify-center gap-2"
            >
              <span>Yes, Count Me In!</span>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="group-hover:translate-x-1 transition-transform duration-300"
              >
                <path 
                  d="M5 12h14m-7-7l7 7-7 7" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            <button
              onClick={onNo}
              className="bg-gray-100 text-gray-700 font-medium px-8 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default WaitlistPopup;
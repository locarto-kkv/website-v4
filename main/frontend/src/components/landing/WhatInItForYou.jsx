// src/components/landing/WhatInItForYou.jsx
import React, { useState } from "react";

const WhatInItForYou = () => {
  const [buttonClicked, setButtonClicked] = useState(false);

  return (
    <div className="relative mt-24 w-full max-w-[80%] mx-auto rounded-3xl bg-orange-500 p-10 md:p-12 shadow-xl min-h-[700px]">
      {/* Header */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-6">
        What's In It For You?
      </h2>
      <p className="text-lg text-white text-center mb-16">
        Share what works, get rewarded
      </p>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center text-white h-full">
          <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F57C00" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-4">Step 1 -</h3>
          <p className="text-sm md:text-base leading-loose flex-grow">
            Find a brand we should know about.
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center text-white h-full">
          <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5M2 17l10-5m0 0l10 5M2 12l10 5v5m0 0v-5m0 5l10-5" stroke="#F57C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-4">Step 2 -</h3>
          <p className="text-sm md:text-base leading-loose flex-grow">
            Send us their information.
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center text-white h-full">
          <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4z" fill="#F57C00" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-4">Step 3 -</h3>
          <p className="text-sm md:text-base leading-loose flex-grow">
            Get credits when they join us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatInItForYou;
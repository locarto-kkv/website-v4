import React from "react";
import Heart from "../../../src/assets/heart.png";
import Arrow from "../../../src/assets/arrow.png";
import Dollar from "../../../src/assets/dollar.png";

const WhatInItForYou = () => {
  return (
    <div className="mt-24 w-full max-w-[400px] sm:max-w-[1200px] mx-auto p-8 md:p-12 rounded-xl shadow-lg min-h-[500px]" style={{ backgroundColor: "#f15b28" }}>
      <h2 className="text-3xl text-[#FFFFFF] text-center mb-6 font-semibold">
        What's In It For You?
      </h2>
      <p className="text-[#FFFFFF] text-center mb-12 font-medium">
        Share what works, get rewarded
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-[#FFFFFF]">
        {/* Step 1 */}
        <div className="p-4">
          <img src={Heart} alt="heart" className="w-32 mx-auto mb-6" />
          <h3 className="font-bold mb-4 text-lg">Step 1 -</h3>
          <p className="text-base">Find a brand we should know about.</p>
        </div>

        {/* Step 2 */}
        <div className="p-4">
          <img src={Arrow} alt="arrow" className="w-32 mx-auto mb-6" />
          <h3 className="font-bold mb-4 text-lg">Step 2 -</h3>
          <p className="text-base">Send us their information.</p>
        </div>

        {/* Step 3 */}
        <div className="p-4">
          <img src={Dollar} alt="dollar" className="w-32 mx-auto mb-6" />
          <h3 className="font-bold mb-4 text-lg">Step 3 -</h3>
          <p className="text-base">Get credits when they join us.</p>
        </div>
      </div>
    </div>
  );
};

export default WhatInItForYou;

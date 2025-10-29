// src/pages/landingpage.jsx
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDataStore } from "../store/useDataStore.jsx";
import { submitEmail } from "../services/betaService.js";

// Components
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import BrandIdentityCard from "../components/landing/card.jsx";
import WhatInItForYou from "../components/landing/WhatInItForYou.jsx";
import TestimonialSlider from "../components/landing/TestimonialSlider.jsx";
import WaitlistPopup from "../components/landing/WaitListPopup.jsx";

// Assets
import tagImg from "../assets/tag.png";
import locartoImg from "../assets/locarto.png";
import landingVid from "../assets/landing_vid.mp4";

// Background Assets - Now using public folder paths
const asset1 = "/assets/1.png";
const asset2 = "/assets/2.png";
const asset3 = "/assets/3.png";
const asset4 = "/assets/4.png";
const asset5 = "/assets/5.png";

const LandingPage = () => {
  const { blogs } = useDataStore();
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleYes = () => {
    document
      .getElementById("beta-signup-section")
      .scrollIntoView({ behavior: "smooth" });
    setShowPopup(false);
  };

  const handleNo = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitEmail(email);
    setEmail("");
  };

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.3; // half speed
    }
  }, []);

  return (
    <div className="font-sans flex flex-col text-[#0D1539] min-h-screen bg-white relative overflow-hidden">
      {/* Background Assets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* ... (background assets remain the same) ... */}
        <img
          src={asset1}
          alt=""
          className="absolute -top-32 -left-32 w-[300px] h-[300px] md:w-[500px] md:h-[500px] opacity-[0.18] animate-[spin_40s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        {/* ... other background images ... */}
        <img
          src={asset2}
          alt=""
          className="absolute top-[2800px] md:top-[4000px] -right-28 md:-right-44 w-[350px] h-[350px] md:w-[590px] md:h-[590px] opacity-[0.18] animate-[spin_46s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
      </div>
      {showPopup && <WaitlistPopup onYes={handleYes} onNo={handleNo} />}

      <Navbar pageType="landing" />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center relative">
        {/* ... (rest of the Hero Section remains the same up to WhatInItForYou) ... */}
        <div className="w-full max-w-7xl px-4 md:px-6">
           {/* ... Hero content ... */}
           <h1 className="mb-2 pt-20 sm:pt-24 md:pt-32 pb-12 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-left relative z-10 animate-[fadeIn_0.8s_ease-in]">
             THE PLATFORM THAT GETS IT...
           </h1>
           {/* ... more hero content ... */}
          <div className="flex flex-col items-center -mt-20 xs:-mt-10 sm:mt-4 md:mt-8 lg:mt-16 relative">
             {/* ... Tag image, slogans, slider, video, text, cards ... */}
            <div className="mt-12 flex justify-center relative z-10">
              <Link
                to="/discover"
                className="bg-[#0D1539] hover:bg-[#1A244C] text-white font-medium py-4 px-8 rounded-[12px] transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 text-xl flex items-center gap-2 cursor-pointer group"
              >
                <span>Discover More</span>
                 <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* WhatInItForYou Container (Reference for Width) */}
        <div className="w-full px-4 sm:px-6 md:px-8">
          <WhatInItForYou />
        </div>

        {/* --- Beta Signup Section Container (Matching Width) --- */}
        <div
            // Added matching width and margin classes
            className="w-full max-w-[400px] sm:max-w-[1200px] mx-auto px-2 sm:px-0 mt-12 sm:mt-16"
        >
            <section
              id="beta-signup-section" // Keep ID for scrolling
              // Removed width/margin classes from here
              className="bg-gradient-to-br from-[#353695] via-[#4a4db5] to-[#5b5fc7] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden"
            >
              {/* ... Background effects remain the same ... */}
               <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                 {/* ... other background divs ... */}
                  <div
                  className="absolute top-1/2 left-1/4 w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full blur-md animate-pulse"
                  style={{ animationDelay: "1s" }}
                 ></div>
               </div>
              <div className="relative z-10">
                 {/* ... Title, description remain the same ... */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Limited Beta Access
                </div>
                 {/* ... h3 and p tags ... */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent px-2">
                   Reserve your spot, Sign up for our Beta
                 </h3>
                 <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed px-2">
                   Be one of the first to explore the future of local discovery.
                   Gain exclusive early access and help shape Locarto the way you
                   want it
                 </p>
                {/* Form using handleSubmit from LandingPage */}
                <form
                  onSubmit={handleSubmit}
                  className="max-w-lg mx-auto space-y-3 sm:space-y-4"
                >
                  <div className="relative group">
                    {/* Name input (visual only) */}
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm font-medium shadow-lg transition-all duration-300 group-hover:bg-white text-sm sm:text-base"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <div className="relative group">
                    {/* Email input */}
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm font-medium shadow-lg transition-all duration-300 group-hover:bg-white text-sm sm:text-base"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-rocket"></i>
                      Reserve My Spot
                    </span>
                  </button>
                </form>
                 {/* ... Footer text remains the same ... */}
                 <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm opacity-80">
                   <div className="flex items-center gap-2">
                     <i className="fas fa-check text-green-300"></i>
                     <span>No spam, ever</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <i className="fas fa-users text-blue-300"></i>
                     <span>Join 1,000+ early adopters</span>
                   </div>
                 </div>
              </div>
            </section>
        </div>
        {/* --- End Beta Signup Section Container --- */}


        {/* Locarto Logo Banner - Bottom */}
        <div className="bg-white w-full overflow-hidden relative z-10 mt-12 sm:mt-16">
          <div className="relative w-full h-48 md:h-64 lg:h-80">
            <img
              src={locartoImg}
              alt="Locarto"
              className="absolute inset-0 w-full h-auto object-contain object-center -translate-y-[25%] transform scale-110"
            />
          </div>
        </div>
      </section>
      <Footer />
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
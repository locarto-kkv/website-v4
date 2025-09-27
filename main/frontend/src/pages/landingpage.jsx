import React, { useState } from "react";

// Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BrandIdentityCard from "../components/landing/card.jsx";

// Data
import brandData from "../branddata.js";

// Assets
import backgroundImg from "../assets/landing_background.png";
import tagImg from "../assets/tag.png";
import locartoImg from "../assets/locarto.png";
import snabbitImg from "../assets/snabbitimage.png"; // Import Snabbit image
import landingVid from "../assets/landing_vid.mp4";
import WhatInItForYou from "/Users/patrick/Desktop/Projects/Locarto_Merge/main/frontend/src/components/landing/WhatInItForYou.jsx";
// --- Assign images to the brand data ---
const brandsWithImages = brandData.map((brand) => {
  if (brand.id === "snabbit") {
    return { ...brand, image: snabbitImg };
  }
  if (brand.id === "locarto") {
    return { ...brand, image: locartoImg }; 
  }
  return brand;
});
// --- End of image assignment ---

const LandingPage = () => {
  const [showCardContent, setShowCardContent] = useState(true);

  const handleReadMore = (brandId) => {
    console.log(`User wants to read more about brand: ${brandId}`);
    alert(`Read more about ${brandId}`);
  };

  return (
    <div className="font-sans flex min-h-screen flex-col bg-[#0D1539] text-[#FBF5E5]">
      <Navbar pageType="landing" />

      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="w-full max-w-7xl text-center px-4 md:px-6">
          {/* Main Title */}
          <h1 className="mb-10 whitespace-nowrap pt-32 pb-12 text-5xl font-extrabold md:text-7xl">
            THE PLATFORM THAT GETS IT...
          </h1>

          {/* Sub Title */}
          <p className="-mt-6 text-left text-3xl leading-relaxed md:text-4xl">
            <span className="text-orange-500">For brands</span> with something
            to say and <br />
            <span className="text-orange-500">For people</span> who want to
            listen.
          </p>

          <div className="flex flex-col items-center mt-16">
            {/* Tag Image + Overlay */}
            <div className="relative grid place-items-center">
              <img
                src={tagImg}
                alt="Tag"
                className="col-start-1 row-start-1 h-[700px] w-full max-w-[1800px] object-contain md:h-[850px]"
              />
              <p className="col-start-1 row-start-1 translate-y-6 font-bold text-center text-2xl md:text-5xl text-[#FBF5E5] whitespace-nowrap [text-shadow:3px_3px_6px_rgba(0,0,0,0.7)]">
                We get what's missing. so we made.
              </p>
            </div>

            {/* Locarto Logo */}
            <img
              src={locartoImg}
              alt="Locarto"
              className="-mt-[300px] sm:-mt-[270px] md:-mt-[340px] lg:-mt-[300px] w-full max-w-[160px] sm:max-w-[220px] md:max-w-[320px] lg:max-w-[420px] h-auto"
              />

            {/* Sub Text */}
            <p className="mt-8 text-center text-2xl font-semibold text-[#FBF5E5] md:text-3xl">
              A Community where
            </p>

            {/* Big Statement */}
            <div className="mt-32 text-center space-y-8">
              <p className="text-orange-500 text-6xl font-extrabold md:text-7xl tracking-wider">
                EMERGING BRANDS
              </p>
              <p className="text-orange-500 text-5xl font-extrabold md:text-6xl tracking-wider">
                MEET
              </p>
              <p className="text-orange-500 text-6xl font-extrabold md:text-7xl tracking-wider">
                SMART CUSTOMERS
              </p>
            </div>

            {/* Video Section */}
            <div className="mt-28 w-full px-0">
              <video
                src={landingVid}
                autoPlay
                muted
                loop
                playsInline
                className="rounded-2xl shadow-2xl w-full max-w-[95%] h-auto max-h-[90vh]"
              >
                <source src={landingVid} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Text Below Video */}
            <div className="mt-28 text-center px-8">
              <h2 className="text-4xl font-extrabold text-[#FBF5E5] md:text-6xl">
                Every Big Brand Started Somewhere
              </h2>
              <p className="mt-6 text-2xl text-[#FBF5E5] md:text-3xl leading-relaxed">
                But Usually Not On Platforms Designed For Big Brands. So We're
                Building <br />
                The Place They Should Have Had From{" "}
                <span className="text-orange-500 font-bold">Day ONE.</span>
              </p>
            </div>

            {/* Extra Section */}
            <div className="mt-24 text-center px-6">
              <h2 className="text-3xl font-bold text-[#FBF5E5] md:text-5xl">
                Brands You've been searching for
              </h2>
            </div>

            {/* Cards Section */}
            <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 md:px-6">
              {brandsWithImages.map((brand) => (
                <BrandIdentityCard
                  key={brand.id}
                  brand={brand}
                  showContent={showCardContent}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>
            <div className="mt-12 flex justify-center">
                <button
                  onClick ={() => alert("Discover More clicked!")}
                  className="bg-[#0D1539] hover:bg-[#1A244C] text-white font-medium py-4 px-8 rounded-[12px] transition-colors duration-200 shadow-md text-xl flex items-center gap-2 cursor-pointer"
                >
                  <span>Discover More</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
          </div>
        </div>
      </section>
      <WhatInItForYou />

      <Footer />
    </div>
  );
};

export default LandingPage;


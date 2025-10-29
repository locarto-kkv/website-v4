// src/pages/DiscoverPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDataStore } from "../store/useDataStore.jsx";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BrandIdentityCard from "../components/landing/card.jsx";
import locartoImg from "../assets/locarto.png";

// Background Assets - Now using public folder paths
const asset1 = "/assets/1.png";
const asset2 = "/assets/2.png";
const asset3 = "/assets/3.png";
const asset4 = "/assets/4.png";
const asset5 = "/assets/5.png";

const DiscoverPage = () => {
  const [email, setEmail] = useState("");
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [logoAnimationKey, setLogoAnimationKey] = useState(0);

  const { blogs } = useDataStore();
  const brandData = blogs.filter((b) => b.blog.length > 0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Logo rotation (all brands) - Uses the updated data
  useEffect(() => {
    if (brandData.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentLogoIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % brandData.length;
        // Trigger animation restart when loop completes
        if (nextIndex === 0) {
          setLogoAnimationKey((prev) => prev + 1);
        }
        return nextIndex;
      });
    }, 3000); // 3 seconds per image

    return () => clearInterval(intervalId);
  }, [brandData.length]);

  // Unique brands, maximum 70 - Uses the updated data with resolved images
  const uniqueBrandCards = [
    ...new Map(brandData.map((b) => [b.id, b])).values(),
  ];
  const brandCards = uniqueBrandCards.slice(0, 70);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  if (!brandData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1539] text-white">
        Brand not found.
      </div>
    );
  }

  return (
    <div className="font-sans flex flex-col text-[#0D1539] min-h-screen bg-white relative overflow-hidden">
      {/* Background Decorative Assets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={asset1}
          alt=""
          className="absolute top-10 -right-20 md:-right-32 w-[280px] h-[280px] md:w-[450px] md:h-[450px] opacity-[0.25] animate-[spin_42s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset3}
          alt=""
          className="absolute top-[500px] md:top-[700px] -left-24 md:-left-36 w-[300px] h-[300px] md:w-[480px] md:h-[480px] opacity-[0.28] animate-[spin_48s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset5}
          alt=""
          className="absolute top-[1000px] md:top-[1400px] -right-28 md:-right-40 w-[320px] h-[320px] md:w-[500px] md:h-[500px] opacity-[0.26] animate-[spin_45s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset2}
          alt=""
          className="absolute top-[1600px] md:top-[2200px] -left-20 md:-left-32 w-[290px] h-[290px] md:w-[460px] md:h-[460px] opacity-[0.27] animate-[spin_50s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset4}
          alt=""
          className="absolute top-[2200px] md:top-[3000px] -right-24 md:-right-36 w-[310px] h-[310px] md:w-[490px] md:h-[490px] opacity-[0.25] animate-[spin_46s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
      </div>

      {/* Navbar */}
      <Navbar pageType="discover" />

      {/* Main Content */}
      <main className="pt-24 pb-16 md:px-8 relative z-10">
        {/* All Brand Images Loop Box */}
        <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#0D1539]/40 overflow-hidden flex justify-center items-center max-w-3xl mx-auto h-56 md:h-72 relative">
          {brandData.map((brand, index) => {
            const opacity = index === currentLogoIndex ? 1 : 0;
            const zIndex = index === currentLogoIndex ? 10 : 0;
            return (
              <img
                key={`${brand.name}-${logoAnimationKey}`} // Include animation key to trigger re-render
                src={brand.blog[0].brand_logo}
                alt={brand.title}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out"
                style={{ opacity, zIndex }}
              />
            );
          })}
        </div>

        {/* Header with back arrow */}
        <div className="mb-12 flex items-center justify-between animate-[fadeIn_1s_ease-in]">
          <div className="flex items-center space-x-4">
            <Link
              to="/landing"
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full bg-gray-100 hover:bg-orange-400 transition-all duration-200 shadow-lg hover:scale-110"
              aria-label="Go back to home"
            >
              <svg
                className="w-6 h-6 text-[#0D1539]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">Back to Home</h1>
          </div>
        </div>

        {/* Grid of BrandIdentityCard Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {brandCards.map((brand, index) => (
            <div
              key={brand.id} // Ensure key is based on the brand's unique ID
              className=""
              style={{
                animation: `fadeIn 0.6s ease-in ${1 + index * 0.1}s both`,
              }}
            >
              {/* Pass the brand data (with resolved image) to the card component */}
              <BrandIdentityCard key={brand.id} brand={brand} />
            </div>
          ))}
        </div>
      </main>

      {/* Locarto Logo Banner - Bottom */}
      <div className="bg-white w-full overflow-hidden relative z-10">
        <div className="relative w-full h-48 md:h-64 lg:h-80">
          <img
            src={locartoImg}
            alt="Locarto"
            className="absolute inset-0 w-full h-auto object-contain object-center -translate-y-[25%] transform scale-110"
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DiscoverPage;

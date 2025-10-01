// src/pages/DiscoverPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Insta from "../assets/insta.png";
import Youtube from "../assets/yt.png";
import Whatsapp from "../assets/whatsapp.png";
import BrandIdentityCard from "../components/landing/card.jsx";
import locartoImg from "../assets/locarto.png";

// Background Assets
import asset1 from "../../src/assets/1.png";
import asset2 from "../../src/assets/2.png";
import asset3 from "../../src/assets/3.png";
import asset4 from "../../src/assets/4.png";
import asset5 from "../../src/assets/5.png";
import { ConsumerBlogService } from "../services/consumer/consumerBlogService.js";

const DiscoverPage = () => {
  const [email, setEmail] = useState("");
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [logoAnimationKey, setLogoAnimationKey] = useState(0);
  const [brandData, setBrandData] = useState([]);
  const navigate = useNavigate();

  const [brandLoading, setBrandLoading] = useState(true);
  const { getBlogs } = ConsumerBlogService;

  useEffect(() => {
    const fetchBlogs = async () => {
      const brandData = await getBlogs();
      setBrandData(brandData);
      setBrandLoading(false);
    };
    fetchBlogs();
  }, []);

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

  // Navigate to brand info page
  const handleReadMore = (brandId) => {
    navigate(`/brand-info/${brandId}`);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  if (!brandData && !brandLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1539] text-white">
        Brand not found.
      </div>
    );
  } else if (brandLoading) {
    return <div>Loading Brands...</div>;
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
      <main className="flex-1 pt-24 pb-16 px-4 md:px-8 relative z-10">
        {/* All Brand Images Loop Box */}
        <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#0D1539]/40 overflow-hidden flex justify-center items-center max-w-3xl mx-auto h-56 md:h-72 relative animate-[fadeIn_0.8s_ease-in]">
          {brandData.map((brand, index) => {
            const opacity = index === currentLogoIndex ? 1 : 0;
            const zIndex = index === currentLogoIndex ? 10 : 0;
            return (
              <img
                key={`${brand.title}-${logoAnimationKey}`} // Include animation key to trigger re-render
                src={brand.brand_logo}
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
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:scale-110"
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
            <h1 className="text-2xl font-bold">
              Brands You've Been Searching For
            </h1>
          </div>
          <button className="text-xl p-2 hover:text-orange-400 transition-colors">
            <i className="fas fa-filter"></i>
          </button>
        </div>

        {/* Grid of BrandIdentityCard Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {brandCards.map((cardData, index) => (
            <div
              key={cardData.id} // Ensure key is based on the brand's unique ID
              className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{
                animation: `fadeIn 0.6s ease-in ${1.2 + index * 0.1}s both`,
              }}
            >
              {/* Pass the brand data (with resolved image) to the card component */}
              <BrandIdentityCard
                brand={cardData}
                showContent={true}
                onReadMore={handleReadMore}
              />
            </div>
          ))}
        </div>

        {/* New Banner Section */}
        <div className="mt-24 py-12 md:py-16 px-4 text-center">
          <h2 className="text-4xl md:text-6xl text-[#0D1539] mb-4">
            {" "}
            This is just the Beginning{" "}
          </h2>
          <p className="text-xl md:text-2xl text-[#0D1539] opacity-90">
            {" "}
            The best is yet to come!{" "}
          </p>
        </div>

        {/* Email Subscription Section */}
        <div className="py-8 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <div className="flex items-stretch border-2 border-[#0D1539]/30 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#0D1539]/50">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emailaddress@gmail.com"
                className="flex-1 px-4 py-2 text-sm text-[#0D1539] bg-transparent focus:outline-none placeholder:text-[#0D1539]/70"
              />
              <button
                onClick={handleSubscribe}
                className="px-4 py-2 text-sm font-medium bg-[#0D1539] text-white hover:bg-[#1A244C] transition-all duration-300 whitespace-nowrap rounded-full hover:scale-110"
              >
                Plug into the rhythm
              </button>
            </div>
          </div>
        </div>

        {/* Social Media Buttons */}
        <div className="py-8 px-4 text-center">
          <div className="max-w-xl mx-auto flex justify-center gap-1">
            <a
              href="https://instagram.com/  "
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-transform duration-300 hover:scale-110"
            >
              <img
                src={Insta}
                alt="Instagram"
                className="w-16 h-16 object-contain cursor-pointer"
              />
            </a>
            <a
              href="https://youtube.com/  "
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-transform duration-300 hover:scale-110"
            >
              <img
                src={Youtube}
                alt="YouTube"
                className="w-16 h-16 object-contain cursor-pointer"
              />
            </a>
            <a
              href="https://wa.me/yournumber/  "
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-transform duration-300 hover:scale-110"
            >
              <img
                src={Whatsapp}
                alt="WhatsApp"
                className="w-16 h-16 object-contain cursor-pointer"
              />
            </a>
          </div>
        </div>

        <div className="-mt-8 py-6 px-4 text-center">
          <h3 className="text-lg md:text-xl font-light text-[#0D1539]/70 inline-block">
            {" "}
            Making it worthwhile.{" "}
          </h3>
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

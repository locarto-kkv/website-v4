// src/pages/BrandInfoPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import brandData from "../branddata.js";
import Insta from "../assets/insta.png";
import Youtube from "../assets/yt.png";
import Whatsapp from "../assets/whatsapp.png";
import locartoImg from "../assets/locarto.png";
import BrandIdentityCard from "../components/landing/card.jsx";

// Background Assets
import asset1 from "../../src/assets/1.png";
import asset2 from "../../src/assets/2.png";
import asset3 from "../../src/assets/3.png";
import asset4 from "../../src/assets/4.png";
import asset5 from "../../src/assets/5.png";

const BrandInfoPage = () => {
  const { brandId } = useParams();
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const foundBrand = brandData.find((b) => b.id === brandId);
    if (foundBrand) {
      setBrand(foundBrand);
    }
  }, [brandId]);

  if (!brand) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1539] text-white">
        Brand not found.
      </div>
    );
  }

  return (
    <div className="font-sans text-[#0D1539] min-h-screen bg-white relative overflow-hidden">
      {/* Background Decorative Assets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Left - Large asset */}
        <img 
          src={asset1} 
          alt="" 
          className="absolute -top-32 -left-32 w-[300px] h-[300px] md:w-[500px] md:h-[500px] opacity-[0.18] animate-[spin_40s_linear_infinite]"
          style={{ filter: 'blur(1px)' }}
        />
                
        {/* Top Right */}
        <img 
          src={asset2} 
          alt="" 
          className="absolute top-10 -right-20 md:-right-32 w-[280px] h-[280px] md:w-[450px] md:h-[450px] opacity-[0.20] animate-[spin_42s_linear_infinite]"
          style={{ filter: 'blur(1px)' }}
        />
        
        {/* Middle Left */}
        <img 
          src={asset4} 
          alt="" 
          className="absolute top-[600px] md:top-[900px] -left-24 md:-left-36 w-[300px] h-[300px] md:w-[480px] md:h-[480px] opacity-[0.18] animate-[spin_48s_linear_infinite_reverse]"
          style={{ filter: 'blur(1px)' }}
        />
        
        {/* Middle Right */}
        <img 
          src={asset1} 
          alt="" 
          className="absolute top-[1200px] md:top-[1600px] -right-28 md:-right-40 w-[320px] h-[320px] md:w-[500px] md:h-[500px] opacity-[0.19] animate-[spin_45s_linear_infinite]"
          style={{ filter: 'blur(1px)' }}
        />
        
       
        
        {/* Bottom Right */}
        <img 
          src={asset3} 
          alt="" 
          className="absolute top-[2400px] md:top-[3200px] -right-24 md:-right-36 w-[310px] h-[310px] md:w-[490px] md:h-[490px] opacity-[0.18] animate-[spin_46s_linear_infinite]"
          style={{ filter: 'blur(1px)' }}
        />
        
        {/* Small accent asset - Hidden on mobile */}
        <img 
          src={asset2} 
          alt="" 
          className="hidden md:block absolute top-[2000px] left-[12%] w-[220px] h-[220px] opacity-[0.15] animate-[spin_38s_linear_infinite_reverse]"
        />
      </div>

      {/* Navbar */}
      <Navbar pageType="brand-info" />

      {/* Brand Image Box */}
      <div className="mt-16 mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg
                      border-2 border-[#0D1539]/40 overflow-hidden flex justify-center items-center
                      max-w-3xl mx-4 sm:mx-auto h-48 sm:h-56 md:h-72 relative z-10 animate-[fadeIn_0.8s_ease-in]">
        {brand.image && (
          <img
            src={brand.image}
            alt={brand.title}
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Back Button */}
        <Link
          to="/discover"
          className="mb-8 inline-flex items-center gap-2 text-[#0D1539] hover:text-orange-400 transition-all duration-300 hover:scale-105 animate-[fadeIn_1s_ease-in]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[#0D1539]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Brands
        </Link>

        {/* Title & Subtitle */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#0D1539] animate-[fadeIn_1.2s_ease-in]">
          {brand.subtitle || `${brand.title} – The Underrated Space Snake Game That Will Hook You Instantly`}
        </h2>

        {/* Description */}
        <div className="prose max-w-none mb-8 text-[#0D1539] animate-[fadeIn_1.4s_ease-in]">
          <p>{brand.description}</p>
        </div>

        {/* Sections with Icons */}
        {brand.sections && brand.sections.map((section, idx) => (
          <div 
            key={idx} 
            className="mb-8"
            style={{ 
              animation: `fadeIn 0.6s ease-in ${1.6 + idx * 0.2}s both`
            }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#0D1539]">
              {section.icon && (
                <span className="text-orange-400">{section.icon}</span>
              )}
              {section.title}
            </h3>
            <div className="prose max-w-none text-[#0D1539]">
              {typeof section.content === "string" ? (
                <p>{section.content}</p>
              ) : (
                <ul className="list-disc pl-6 space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        {/* Rating */}
        {brand.rating && (
          <div className="mt-8 flex items-center gap-2 text-[#0D1539]">
            <span>Rating:</span>
            <div className="flex">
              {"★".repeat(Math.floor(brand.rating))}{" "}
              {"☆".repeat(5 - Math.floor(brand.rating))}
            </div>
            <span>({brand.rating}/5)</span>
          </div>
        )}

        {/* Related Cards Section */}
        <div className="mt-12 border-t pt-8 border-[#0D1539]/30">
          <h3 className="text-xl font-bold mb-6 text-[#0D1539]">
            You Might Also Like
          </h3>
          <div className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {(() => {
              const relatedBrands = brand.related || [];
              const allBrands = brandData;
              
              const getRandomBrandById = (id) => {
                return allBrands.find(b => b.id === id) || null;
              };

              const relatedBrandObjects = relatedBrands
                .map(relatedItem => getRandomBrandById(relatedItem.id))
                .filter(brandObj => brandObj !== null);

              const shuffled = [...relatedBrandObjects];
              for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
              }

              const selectedBrands = shuffled;

              return selectedBrands.map((relatedBrandObj, idx) => {
                if (!relatedBrandObj) return null;
                return (
                  <div 
                    key={idx} 
                    className="flex justify-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  >
                    <BrandIdentityCard
                      brand={relatedBrandObj}
                      showContent={true}
                      onReadMore={() => console.log(`Read more for related brand: ${relatedBrandObj.id}`)}
                    />
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </main>

      {/* New Banner Section */}
      <div className="mt-24 py-12 md:py-16 px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl text-[#0D1539] mb-4">
          This is just the Beginning
        </h2>
        <p className="text-xl md:text-2xl text-[#0D1539] opacity-90">
          The best it yet to come!
        </p>
      </div>

      {/* Email Subscription Section */}
      <div className="py-8 px-4 text-center relative z-10">
        <div className="max-w-xl mx-auto">
          <div className="flex items-stretch border-2 border-[#0D1539]/30 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#0D1539]/50">
            <input
              type="email"
              placeholder="emailaddress@gmail.com"
              className="flex-1 px-4 py-2 text-sm text-[#0D1539] bg-transparent focus:outline-none placeholder:text-[#0D1539]/70"
            />
            <button className="px-4 py-2 text-sm font-medium bg-[#0D1539] text-white hover:bg-[#1A244C] transition-all duration-300 whitespace-nowrap rounded-full hover:scale-105">
              Plug into the rhythm
            </button>
          </div>
        </div>
      </div>

      {/* Social Media Buttons */}
      <div className="py-8 px-4 text-center relative z-10">
        <div className="max-w-xl mx-auto flex justify-center gap-1">
          <a 
            href="https://instagram.com" 
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
            href="https://youtube.com" 
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
            href="https://wa.me/yournumber" 
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

      <div className="-mt-8 py-6 px-4 text-center relative z-10">
        <h3 className="text-lg md:text-xl font-light text-[#0D1539]/70 inline-block">
          Making it worthwhile.
        </h3>
      </div>

      {/* Locarto Logo Banner - Bottom */}
      <div className="w-full overflow-hidden relative z-10">
        <div className="relative w-full h-48 md:h-64 lg:h-80">
          <img
            src={locartoImg}
            alt="Locarto"
            className="absolute inset-0 w-full h-auto object-contain object-center -translate-y-[10%]"
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
      
      <style jsx>{`
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

export default BrandInfoPage;
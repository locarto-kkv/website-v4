// src/pages/BrandInfoPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
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

const BrandInfoPage = () => {
  const { brandName } = useParams();
  const [brand, setBrand] = useState();
  const brands = useDataStore((s) => s.brands);
  const brandData = brands.filter((b) => b.blog.length > 0);

  // Scroll to top whenever brandId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [brandName]);

  useEffect(() => {
    if (brandData.length < 1) return;
    const foundBrand = brandData.find((b) => b.name === brandName);

    setBrand(foundBrand?.blog[0] || null);
  }, [brandName, brandData]);

  // FIX: Memoize the random brands so they don't change on every render
  const randomBrands = useMemo(() => {
    if (!brand || !brandData) {
      return [];
    }
    // Shuffle + get random brands (excluding current one)

    const otherBrands = brandData.filter(
      (b) => b.blog[0]?.title !== brand.title
    );

    for (let i = otherBrands.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherBrands[i], otherBrands[j]] = [otherBrands[j], otherBrands[i]];
    }
    return otherBrands.slice(0, 3);
  }, [brand, brandData]);

  if (!brand) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1539] text-white">
        Blog not uploaded yet.
      </div>
    );
  }

  return (
    <div className="font-sans text-[#0D1539] min-h-screen bg-white relative overflow-hidden">
      {/* Background Decorative Assets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={asset1}
          alt=""
          className="absolute -top-32 -left-32 w-[300px] h-[300px] md:w-[500px] md:h-[500px] opacity-[0.18] animate-[spin_40s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset2}
          alt=""
          className="absolute top-10 -right-20 md:-right-32 w-[280px] h-[280px] md:w-[450px] md:h-[450px] opacity-[0.20] animate-[spin_42s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset4}
          alt=""
          className="absolute top-[600px] md:top-[900px] -left-24 md:-left-36 w-[300px] h-[300px] md:w-[480px] md:h-[480px] opacity-[0.18] animate-[spin_48s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset1}
          alt=""
          className="absolute top-[1200px] md:top-[1600px] -right-28 md:-right-40 w-[320px] h-[320px] md:w-[500px] md:h-[500px] opacity-[0.19] animate-[spin_45s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset3}
          alt=""
          className="absolute top-[2400px] md:top-[3200px] -right-24 md:-right-36 w-[310px] h-[310px] md:w-[490px] md:h-[490px] opacity-[0.18] animate-[spin_46s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset2}
          alt=""
          className="hidden md:block absolute top-[2000px] left-[12%] w-[220px] h-[220px] opacity-[0.15] animate-[spin_38s_linear_infinite_reverse]"
        />
      </div>

      <Navbar pageType="brand-info" />

      {/* Brand Image */}
      <div className="mt-28 mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#0D1539]/40 overflow-hidden flex justify-center items-center max-w-3xl mx-4 sm:mx-auto h-48 sm:h-56 md:h-72 relative z-10 animate-[fadeIn_0.8s_ease-in]">
        {
          <img
            src={brand.blog_image}
            alt={brand.title}
            className="absolute inset-0 w-full h-full object-contain"
          />
        }
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* REVISED: Made rating section responsive */}
        {brand.rating && (
          <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3 text-xl sm:text-2xl md:text-3xl text-[#0D1539]">
            <span className="font-medium">
              <span className="text-orange-400 font-bold">LETY</span> Rating:
            </span>
            <div className="flex text-3xl sm:text-4xl md:text-5xl text-purple-900">
              {"★".repeat(Math.floor(brand.rating))}
              {"☆".repeat(5 - Math.floor(brand.rating))}
            </div>
            <span className="text-lg sm:text-xl md:text-2xl">
              ({brand.rating}/5)
            </span>
          </div>
        )}

        {/* REVISED: Smoother font scaling for brand title and subtitle */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 mt-10 text-[#0D1539] animate-[fadeIn_1.2s_ease-in]">
          {brand.title}
        </h2>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 mt-10 text-[#0D1539] animate-[fadeIn_1.2s_ease-in]">
          {brand.subtitle}
        </h2>

        <div className="prose max-w-none mb-8 text-[#0D1539] animate-[fadeIn_1.4s_ease-in]">
          <p>{brand.description}</p>
        </div>

        {/* Sections */}
        {brand.sections?.map((section, idx) => (
          <div
            key={idx}
            className="mb-8"
            style={{
              animation: "fadeIn 0.6s ease-in ${1.6 + idx * 0.2}s both",
            }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#0D1539]">
              {section.icon && (
                <span className="text-orange-400">{section.icon}</span>
              )}
              {section.title}
            </h3>
            <div className="prose max-w-none text-[#0D1539]">
              {Array.isArray(section.content) ? (
                <ul className="list-disc pl-6 space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          </div>
        ))}

        <Link
          to="/discover"
          className="mb-4 mt-4 inline-flex items-center gap-4 text-[#0D1539] animate-[fadeIn_1s_ease-in]"
        >
          <div className="p-4 bg-gray-100 rounded-full hover:bg-orange-400 transition-all duration-200 hover:scale-110">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[#0D1539]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <span className="text-xl font-semibold">Back to Brands</span>
        </Link>

        {/* Related */}
        {randomBrands.length > 0 && (
          <div className="mt-12 border-t pt-8 border-[#0D1539]/30">
            <h3 className="text-xl font-bold mb-6 text-[#0D1539]">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {randomBrands.map((randomBrand) => (
                <BrandIdentityCard key={randomBrand.id} brand={randomBrand} />
              ))}
            </div>
          </div>
        )}
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

export default BrandInfoPage;

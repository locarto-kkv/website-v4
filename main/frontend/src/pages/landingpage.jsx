import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../context/blogContext.jsx";

// Components
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import BrandIdentityCard from "../components/landing/card.jsx";
import WhatInItForYou from "../components/landing/WhatInItForYou.jsx";
import RegisterSocial from "../components/RegisterSocial.jsx";

// Assets
import tagImg from "../assets/tag.png";
import locartoImg from "../assets/locarto.png";
import landingVid from "../assets/landing_vid.mp4";

// Background Assets
import asset1 from "../../src/assets/1.png";
import asset2 from "../../src/assets/2.png";
import asset3 from "../../src/assets/3.png";
import asset4 from "../../src/assets/4.png";
import asset5 from "../../src/assets/5.png";

const LandingPage = () => {
  const { blogs } = useBlogs();

  return (
    <div className="font-sans flex flex-col text-[#0D1539] min-h-screen bg-white relative overflow-hidden">
      {/* Background Assets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={asset1}
          alt=""
          className="absolute -top-32 -left-32 w-[300px] h-[300px] md:w-[500px] md:h-[500px] opacity-[0.18] animate-[spin_40s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset4}
          alt=""
          className="absolute top-20 -right-24 md:-right-40 w-[350px] h-[350px] md:w-[600px] md:h-[600px] opacity-[0.16] animate-[spin_50s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset2}
          alt=""
          className="absolute top-[600px] md:top-[800px] -left-32 md:-left-48 w-[320px] h-[320px] md:w-[550px] md:h-[550px] opacity-[0.20] animate-[spin_45s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset5}
          alt=""
          className="absolute top-[900px] md:top-[1200px] -right-36 md:-right-52 w-[360px] h-[360px] md:w-[620px] md:h-[620px] opacity-[0.17] animate-[spin_55s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset3}
          alt=""
          className="absolute top-[1400px] md:top-[2000px] -left-28 md:-left-44 w-[340px] h-[340px] md:w-[580px] md:h-[580px] opacity-[0.19] animate-[spin_42s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset1}
          alt=""
          className="absolute top-[1800px] md:top-[2600px] -right-32 md:-right-48 w-[330px] h-[330px] md:w-[560px] md:h-[560px] opacity-[0.20] animate-[spin_48s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset4}
          alt=""
          className="absolute top-[2400px] md:top-[3400px] -left-40 md:-left-56 w-[380px] h-[380px] md:w-[640px] md:h-[640px] opacity-[0.17] animate-[spin_52s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset2}
          alt=""
          className="absolute top-[2800px] md:top-[4000px] -right-28 md:-right-44 w-[350px] h-[350px] md:w-[590px] md:h-[590px] opacity-[0.18] animate-[spin_46s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
      </div>
      <Navbar pageType="landing" />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center relative">
        <div className="w-full max-w-7xl px-4 md:px-6">
          {/* REVISED: Smaller base font and padding for mobile, with more steps for smooth scaling. */}
          <h1 className="mb-2 pt-20 sm:pt-24 md:pt-32 pb-12 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-left relative z-10 animate-[fadeIn_0.8s_ease-in]">
            THE PLATFORM THAT GETS IT...
          </h1>

          {/* REVISED: Reduced base text size for mobile. */}
          <p className="-mt-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed text-left relative z-10 animate-[fadeIn_1s_ease-in]">
            <span className="[color:#f15b28]">For brands</span> with something
            to say and <br />
            <span className="[color:#f15b28]">For people</span> who want to
            listen.
          </p>

          <div className="flex flex-col items-center -mt-40 sm:mt-8 md:mt-16 relative">
            {/* Tag Image + Overlay */}
            <div className="relative grid place-items-center animate-[fadeIn_1.2s_ease-in]">
              <img
                src={tagImg}
                alt="Tag"
                className="col-start-1 row-start-1 h-[700px] w-full max-w-[1800px] object-contain md:h-[850px]"
              />
              {/* REVISED: Smoother font scaling for the text on the tag image. */}
              <p className="col-start-1 row-start-1 translate-y-2 font-bold text-center text-xs sm:text-sm md:text-2xl lg:text-4xl xl:text-5xl text-[#FBF5E5] whitespace-nowrap [text-shadow:3px_3px_6px_rgba(0,0,0,0.7)]">
                We get what's missing. so we made.
              </p>
            </div>

            <img
              src={locartoImg}
              alt="Locarto"
              className="-mt-[345px] sm:-mt-[270px] md:-mt-[340px] lg:-mt-[385px] w-full max-w-[180px] sm:max-w-[260px] md:max-w-[380px] lg:max-w-[500px] h-auto relative z-10 animate-[fadeIn_1.4s_ease-in]"
            />
            <p className="mt-8 text-center text-2xl font-semibold md:text-3xl relative z-10 animate-[fadeIn_1.6s_ease-in]">
              A Community where
            </p>

            {/* REVISED: Smaller base font size for "EMERGING BRANDS", etc., to prevent overflow on small screens. */}
            <div className="mt-32 text-center space-y-8 relative z-10 animate-[fadeIn_1.8s_ease-in]">
              <p className="[color:#f15b28] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-wider">
                EMERGING BRANDS
              </p>
              <p className="[color:#f15b28] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-wider">
                MEET
              </p>
              <p className="[color:#f15b28] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-wider">
                SMART CUSTOMERS
              </p>
            </div>

            {/* Video Section */}
            <div className="mt-28 w-full px-4 flex justify-center relative z-10 animate-[fadeIn_2s_ease-in]">
              <div className="relative group">
                <div className="absolute -inset-2 bg-[#0D1539]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="relative rounded-2xl shadow-2xl w-full max-w-[800px] h-auto"
                >
                  <source src={landingVid} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* REVISED: Smoother font scaling for this section. */}
            <div className="mt-28 text-center px-8 relative z-10 animate-[fadeIn_2.2s_ease-in]">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold">
                Every Big Brand Started Somewhere
              </h2>
              <p className="mt-6 text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed">
                But Usually Not On Platforms Designed For Big Brands. So We're
                Building <br />
                The Place They Should Have Had From{" "}
                <span className="[color:#f15b28] font-bold">Day ONE.</span>
              </p>
            </div>

            {/* REVISED: Smoother font scaling. */}
            <div className="mt-24 text-center px-6 relative z-10 animate-[fadeIn_2.4s_ease-in]">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                Brands You've been searching for
              </h2>
            </div>

            {/* Cards Section */}
            <div className="mt-16 w-full flex justify-center px-4 md:px-6 relative z-10">
              <div className="w-full max-w-7xl">
                <div
                  className="
                grid gap-12 justify-center
                [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]
              "
                >
                  {blogs &&
                    blogs.slice(0, 3).map((brand, idx) => (
                      <div key={brand.id} className="flex justify-center">
                        <BrandIdentityCard brand={brand} />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Discover More Button */}
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

        {/* ✅ Responsive Padding for WhatInItForYou */}
        <div className="w-full px-4 sm:px-6 md:px-8">
          <WhatInItForYou />
        </div>

        <RegisterSocial />

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

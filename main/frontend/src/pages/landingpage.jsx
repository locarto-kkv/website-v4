import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BrandIdentityCard from "../components/landing/card.jsx";
import WhatInItForYou from "../components/landing/WhatInItForYou.jsx";

// Data
import brandData from "../branddata.js";

// Assets
import tagImg from "../assets/tag.png";
import locartoImg from "../assets/locarto.png";
import snabbitImg from "../assets/snabbitimage.png";
import landingVid from "../assets/landing_vid.mp4";
import Insta from "../../src/assets/insta.png";
import Youtube from "../../src/assets/yt.png";
import Whatsapp from "../../src/assets/whatsapp.png";

// Background Assets
import asset1 from "../../src/assets/1.png";
import asset2 from "../../src/assets/2.png";
import asset3 from "../../src/assets/3.png";
import asset4 from "../../src/assets/4.png";
import asset5 from "../../src/assets/5.png";

// --- Assign images to the brand data ---
const brandsWithImages = brandData.map((brand) => {
if (brand.id === "snabbit") return { ...brand, image: snabbitImg };
if (brand.id === "locarto") return { ...brand, image: locartoImg };
return brand;
});
// --- End of image assignment ---

const LandingPage = () => {
const [showCardContent, setShowCardContent] = useState(true);
const navigate = useNavigate();

const handleReadMore = (brandId) => {
navigate(`/brand-info/${brandId}`);
};

return ( <div className="font-sans flex flex-col text-[#0D1539] min-h-screen bg-white relative overflow-hidden">
{/* Background Assets */} <div className="absolute inset-0 pointer-events-none overflow-hidden">
<img
src={asset1}
alt=""
className="absolute -top-32 -left-32 w-[300px] h-[300px] md:w-[500px] md:h-[500px] opacity-[0.18] animate-[spin_40s_linear_infinite]"
style={{ filter: 'blur(1px)' }}
/>
<img
src={asset4}
alt=""
className="absolute top-20 -right-24 md:-right-40 w-[350px] h-[350px] md:w-[600px] md:h-[600px] opacity-[0.16] animate-[spin_50s_linear_infinite_reverse]"
style={{ filter: 'blur(1px)' }}
/>
<img
src={asset2}
alt=""
className="absolute top-[600px] md:top-[800px] -left-32 md:-left-48 w-[320px] h-[320px] md:w-[550px] md:h-[550px] opacity-[0.20] animate-[spin_45s_linear_infinite]"
style={{ filter: 'blur(1px)' }}
/>
<img
src={asset5}
alt=""
className="absolute top-[900px] md:top-[1200px] -right-36 md:-right-52 w-[360px] h-[360px] md:w-[620px] md:h-[620px] opacity-[0.17] animate-[spin_55s_linear_infinite_reverse]"
style={{ filter: 'blur(1px)' }}
/>
<img
src={asset3}
alt=""
className="absolute top-[1400px] md:top-[2000px] -left-28 md:-left-44 w-[340px] h-[340px] md:w-[580px] md:h-[580px] opacity-[0.19] animate-[spin_42s_linear_infinite_reverse]"
style={{ filter: 'blur(1px)' }}
/>
<img
src={asset1}
alt=""
className="absolute top-[1800px] md:top-[2600px] -right-32 md:-right-48 w-[330px] h-[330px] md:w-[560px] md:h-[560px] opacity-[0.20] animate-[spin_48s_linear_infinite]"
style={{ filter: 'blur(1px)' }}
/>
<img
src={asset4}
alt=""
className="absolute top-[2400px] md:top-[3400px] -left-40 md:-left-56 w-[380px] h-[380px] md:w-[640px] md:h-[640px] opacity-[0.17] animate-[spin_52s_linear_infinite_reverse]"
style={{ filter: 'blur(1px)' }}
/>
<img
src={asset2}
alt=""
className="absolute top-[2800px] md:top-[4000px] -right-28 md:-right-44 w-[350px] h-[350px] md:w-[590px] md:h-[590px] opacity-[0.18] animate-[spin_46s_linear_infinite]"
style={{ filter: 'blur(1px)' }}
/> </div>

```
  <Navbar pageType="landing" />

  {/* Hero Section */}
  <section className="flex flex-col items-center justify-center relative">
    <div className="w-full max-w-7xl px-4 md:px-6">
      <h1 className="mb-2 pt-32 pb-12 text-3xl font-extrabold text-left md:text-5xl lg:text-7xl relative z-10 animate-[fadeIn_0.8s_ease-in]">
        THE PLATFORM THAT GETS IT...
      </h1>

      <p className="-mt-2 text-xl leading-relaxed text-left md:text-3xl lg:text-4xl relative z-10 animate-[fadeIn_1s_ease-in]">
        <span className="[color:#f15b28]">For brands</span> with something
        to say and <br />
        <span className="[color:#f15b28]">For people</span> who want to
        listen.
      </p>

      <div className="flex flex-col items-center mt-8 md:mt-16 relative">
        {/* Tag Image + Overlay */}
        <div className="relative grid place-items-center animate-[fadeIn_1.2s_ease-in]">
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
          className="-mt-[300px] sm:-mt-[270px] md:-mt-[340px] lg:-mt-[300px] w-full max-w-[160px] sm:max-w-[220px] md:max-w-[320px] lg:max-w-[420px] h-auto relative z-10 animate-[fadeIn_1.4s_ease-in]"
        />

        <p className="mt-8 text-center text-2xl font-semibold md:text-3xl relative z-10 animate-[fadeIn_1.6s_ease-in]">
          A Community where
        </p>

        <div className="mt-32 text-center space-y-8 relative z-10 animate-[fadeIn_1.8s_ease-in]">
          <p className="[color:#f15b28] text-6xl font-extrabold md:text-7xl tracking-wider">
            EMERGING BRANDS
          </p>
          <p className="[color:#f15b28] text-5xl font-extrabold md:text-6xl tracking-wider">
            MEET
          </p>
          <p className="[color:#f15b28] text-6xl font-extrabold md:text-7xl tracking-wider">
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

        <div className="mt-28 text-center px-8 relative z-10 animate-[fadeIn_2.2s_ease-in]">
          <h2 className="text-4xl font-extrabold md:text-6xl">
            Every Big Brand Started Somewhere
          </h2>
          <p className="mt-6 text-2xl md:text-3xl leading-relaxed">
            But Usually Not On Platforms Designed For Big Brands. So We're
            Building <br />
            The Place They Should Have Had From{" "}
            <span className="[color:#f15b28] font-bold">Day ONE.</span>
          </p>
        </div>

        <div className="mt-24 text-center px-6 relative z-10 animate-[fadeIn_2.4s_ease-in]">
          <h2 className="text-3xl font-bold md:text-5xl">
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
              {brandsWithImages.slice(0, 3).map((brand, idx) => (
                <div 
                  key={brand.id} 
                  className="flex justify-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  style={{ 
                    animation: `fadeIn 0.6s ease-in ${2.6 + idx * 0.2}s both`
                  }}
                >
                  <BrandIdentityCard
                    brand={brand}
                    showContent={showCardContent}
                    onReadMore={handleReadMore}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Discover More Button */}
        <div className="mt-12 flex justify-center relative z-10 animate-[fadeIn_3.2s_ease-in]">
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

    {/* New Banner Section */}
    <div className="mt-24 bg-white py-12 md:py-16 px-4 text-center relative z-10">
      <h2 className="text-4xl md:text-6xl text-[#0D1539] mb-4">
        This is just the Beginning
      </h2>
      <p className="text-xl md:text-2xl text-[#0D1539] opacity-90">
        The best is yet to come!
      </p>
    </div>

    {/* Email Subscription Section */}
    <div className="bg-white py-8 px-4 text-center relative z-10">
      <div className="max-w-xl mx-auto">
        <div className="flex items-stretch border border-[#0D1539]/30 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#0D1539]/50">
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
    <div className="bg-white py-8 px-4 text-center relative z-10">
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

    {/* Bottom Banner */}
    <div className="-mt-8 bg-white py-6 px-4 text-center relative z-10">
      <h3 className="text-lg md:text-xl font-light text-[#0D1539]/70 inline-block">
        Making it worthwhile.
      </h3>
    </div>

    {/* Locarto Logo Banner - Bottom */}
    <div className="bg-white w-full overflow-hidden relative z-10">
      <div className="relative w-full h-48 md:h-64 lg:h-80">
        <img
          src={locartoImg}
          alt="Locarto"
          className="absolute inset-0 w-full h-auto object-contain object-center -translate-y-[10%]"
        />
      </div>
    </div>
  </section>

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

export default LandingPage;

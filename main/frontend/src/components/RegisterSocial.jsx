import { useState } from "react";
import Insta from "../../src/assets/insta.png";
import Youtube from "../../src/assets/yt.png";
import Whatsapp from "../../src/assets/whatsapp.png";
import { submitEmail } from "../services/beta.service";

function RegisterSocial() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitEmail(email);
  };

  return (
    <div>
      {/* New Banner Section */}
      <div className="mt-24 bg-tranparent py-12 md:py-16 px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl text-[#0D1539] mb-4">
          This is just the Beginning
        </h2>
        <p className="text-xl md:text-2xl text-[#0D1539] opacity-90">
          The best is yet to come!
        </p>
      </div>
      {/* Email Subscription Section */}
      <div className="flex bg-transparent py-1 px-4 text-center relative z-10">
        <div className="container mx-auto w-full max-w-xl">
          <form
            className="flex w-full items-stretch border border-[#0D1539]/30 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#0D1539]/50 h-12 sm:h-14"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 min-w-0 px-4 py-2 text-base sm:text-lg text-[#0D1539] bg-transparent focus:outline-none placeholder:text-[#0D1539]/70"
            />
            <button
              className="px-4 sm:px-6 py-2 text-sm sm:text-base font-medium bg-[#0D1539] text-white hover:bg-[#1A244C] transition-all duration-300 whitespace-nowrap rounded-full hover:scale-105 shrink-0"
              type="submit"
            >
              {/* REVISED: Responsive button text */}
              <span className="sm:hidden">Subscribe</span>
              <span className="hidden sm:inline">Plug into the rhythm</span>
            </button>
          </form>
        </div>
      </div>

      {/* Social Media Buttons */}
      <div className="bg-transparent py-8 px-4 text-center relative z-10">
        <div className="max-w-xl mx-auto flex justify-center gap-1">
          <a
            href="https://www.instagram.com/locarto.in/"
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
        </div>
      </div>
      <div className="-mt-8 py-6 px-4 text-center relative z-10">
        <h3 className="text-lg md:text-xl font-light text-[#0D1539]/70 inline-block">
          Making it worthwhile.
        </h3>
      </div>
    </div>
  );
}

export default RegisterSocial;

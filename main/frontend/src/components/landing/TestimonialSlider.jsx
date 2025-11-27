import React, { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    user: "Arish",
    content:
      "Shopping feels like exploring cities, discovering brands and experiencing cultures.",
  },
  { user: "Divyanshi", content: "Low-key obsessed." },
  { user: "Aria", content: "It just feels… clean." },
  {
    user: "Jamshed",
    content: "This is how online shopping should’ve always been.",
  },
  { user: "Farhang", content: "Feels like the future of shopping fr." },
  { user: "Priyanka", content: "No more feeling lost in a cluttered catalog." },
  { user: "Maazyar Sinor", content: "The recommendations are CRAZY good." },
  {
    user: "Drishti",
    content:
      "Locarto feels like Google Maps but for shopping and I’m weirdly addicted.",
  },
  {
    user: "Deanne",
    content:
      "The way Locarto makes everything look clean and not ‘buy this buy that’ is so refreshing.",
  },
  {
    user: "Siddhi",
    content:
      "Scrolling through Locarto feels like exploring businesses across India. Kinda wholesome.",
  },
  {
    user: "Palak",
    content: "Using Locarto is a vibe. Idk how else to explain it.",
  },
  {
    user: "Krish",
    content:
      "Finally an app that doesn’t attack me with ads the second I breathe.",
  },
  {
    user: "Aman",
    content:
      "Honestly just happy I don’t have to scroll through 800 items to find what I want.",
  },
  { user: "Nivan", content: "I have been convinced." },
  {
    user: "Aryan",
    content:
      "Found so many cool brands I’ve never heard of. Love this for my personality.",
  },
  {
    user: "Zareik",
    content:
      "Why does this app feel more trustworthy than every marketplace I’ve used before?",
  },
  { user: "Sean", content: "The checkout is so fast it should win an award." },
];

const TestimonialSlider = () => {
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const cardWidth = 340 + 24;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev - 1;
        if (Math.abs(newOffset) >= cardWidth * testimonials.length) {
          return 0;
        }
        return newOffset;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused]);

  const extendedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  return (
    <div
      className="w-full overflow-hidden relative py-16 px-4"
      id="testimonials"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 text-[#0D1539]">
        TESTIMONIALS FROM OUR COMMUNITY
      </h2>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex gap-6 transition-transform"
          style={{
            transform: `translateX(${offset}px)`,
            transition: isPaused ? "transform 0.3s ease-out" : "none",
          }}
        >
          {extendedTestimonials.map((t, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[340px] bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              }}
            >
              <div className="mb-6">
                <p className="font-bold text-[#0D1539] text-lg">{t.user}</p>
              </div>
              <p className="text-gray-700 leading-relaxed italic text-base">
                "{t.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;

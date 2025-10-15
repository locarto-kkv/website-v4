import React, { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    quote:
      "Locarto gave our brand the visibility we needed to grow. The platform is intuitive and the community is incredibly supportive.",
    author: "Aisha Khan",
    role: "Founder, Urban Style Boutique",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    quote:
      "Finally, a marketplace that understands the challenges of emerging brands. We've seen a significant increase in sales since joining.",
    author: "Rohan Mehta",
    role: "CEO, Serenity Yoga Studio",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    quote:
      "The analytics tools are a game-changer. We can now make data-driven decisions to better serve our customers.",
    author: "Priya Sharma",
    role: "Owner, Casa Living",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    quote:
      "Connecting with customers who genuinely appreciate our craft has been the best part of our Locarto experience.",
    author: "Vikram Singh",
    role: "Artisan, Golden Crown Jewellers",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    quote:
      "As a customer, I love discovering unique brands that I wouldn't find on larger e-commerce sites. It feels more personal.",
    author: "Anjali Rao",
    role: "Smart Customer",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    quote:
      "The setup process was seamless, and the support team is always ready to help. Highly recommended for any new brand.",
    author: "Sameer Verma",
    role: "Manager, Timepiece Gallery",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    quote:
      "Locarto is more than a platform; it's a community. We've built relationships with both customers and other vendors.",
    author: "Neha Reddy",
    role: "Co-founder, Mindful Fitness Center",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    quote:
      "The focus on storytelling helps us connect with our audience on a deeper level. Our brand's message is finally being heard.",
    author: "Karan Desai",
    role: "Marketing Head, Apex Innovations",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
];

const TestimonialSlider = () => {
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const cardWidth = 340 + 24; // card width + gap

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev - 1;
        // Reset when we've scrolled through one full set
        if (Math.abs(newOffset) >= cardWidth * testimonials.length) {
          return 0;
        }
        return newOffset;
      });
    }, 30); // Smooth 30ms interval

    return () => clearInterval(interval);
  }, [isPaused]);

  // Create enough copies to fill the view and have seamless loop
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
        ref={containerRef}
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
          {extendedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[340px] bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              }}
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-[#f15b28] shadow-md"
                />
                <div>
                  <p className="font-bold text-[#0D1539] text-lg">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic text-base">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;

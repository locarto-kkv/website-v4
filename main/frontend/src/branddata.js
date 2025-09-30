// src/branddata.js

// Import local images (relative to src folder)
import adidas from './assets/adidas.png';
import Burberry from './assets/Burberry.png';
import chanel from './assets/chanel.png';
import levis from './assets/levis.png';
import nike from './assets/nike.png';
import Puma from './assets/Puma.png';
import supreme from './assets/supreme.png';
import thenorthface from './assets/thenorthface.png';
import tommyhilfiger from './assets/tommyhilfiger.jpg';
import snabbitImg from "./assets/snabbitimage.png"; // Import Snabbit image
import locartoImg from "./assets/locarto.png"; // Import Locarto image
import jordanImg from "./assets/jordan.png"; // 🆕 Import Jordan image

// Map image imports to brand IDs
const imageUrls = {
  snabbit: snabbitImg,      // Use actual Snabbit image
  locarto: locartoImg,      // Use actual Locarto image
  dummy1: nike,
  dummy2: Burberry,
  dummy3: chanel,
  dummy4: levis,
  dummy5: supreme,
  dummy6: thenorthface,
  dummy7: tommyhilfiger,
  dummy8: jordanImg,  
  dummy9: Puma,
  dummy10: adidas,       // 🆕 New: Jordan image assigned to dummy8
};

const brandData = [
  {
    id: "snabbit",
    title: "Snabbit",
    subtitle: "The Underrated Space Snake Game That Will Hook You Instantly",
    description: "Fast, challenging space snake game with simple tap-to-switch gravity mechanics. Visually sleek, addictive gameplay combining classic snake with modern physics and side-scrolling action.",
    image: imageUrls.snabbit,
    sections: [
      {
        title: "What Is Snabbit?",
        icon: "✨",
        content: "In a world where mobile games often feel repetitive or overly complex, Snabbit comes in as a refreshing throwback with a modern twist. Fast, challenging, and visually sleek, Snabbit is a space-themed arcade game that fuses the classic mechanics of Snake with side-scrolling action and physics-based gameplay. At its core, Snabbit is a minimalist arcade game where you control a speedy space snake named Sebi (short for 'Space Bunny'), navigating through tight tunnels, narrow gaps, and dangerous traps across the galaxy. The twist? You can't stop moving. Your only action is to reverse gravity — tap the screen to make the snake bounce from the top of the tunnel to the bottom, and vice versa. That simple control mechanic creates a surprising depth of challenge, especially as levels grow more complex."
      },
      {
        title: "Gameplay: Simple To Learn, Hard To Master",
        icon: "🎮",
        content: "Snabbit shines in its ability to take a simple premise and layer it with difficulty in clever, gradual ways. There are no complicated controls or mechanics to memorize — just tap to switch gravity and keep moving forward. Players must avoid obstacles like spikes, rotating barriers, lasers, and moving platforms, all while collecting stars to boost their score. The tension builds as the speed increases and the screen scrolls relentlessly forward. What makes Snabbit so addictive? Precision-based gameplay that rewards skill and timing; dozens of uniquely designed levels, each with escalating difficulty; a fast retry loop — crash, restart, try again, with no waiting and no penalties; and leaderboards and stars that add replay value for completionists."
      },
      {
        title: "Art & Sound: Minimalism Done Right",
        icon: "🎨",
        content: "Snabbit is a masterclass in minimalistic game design. The visual style is clean, using stark backgrounds with vibrant foreground elements. The animations are smooth, and the game's color palette makes obstacles easy to distinguish, which is crucial when playing at high speeds. The soundtrack is ambient and futuristic, complementing the game's space setting subtly but effectively for immersion. It's subtle, but effective — just enough to keep you immersed without overwhelming the gameplay."
      },
      {
        title: "Why You'll Keep Coming Back",
        icon: "🔁",
        content: "Snabbit is the kind of game that thrives on its 'just one more try' loop. Every failed attempt feels like your fault — which means every success is deeply satisfying. It's perfect for both short bursts during a commute or long grinding sessions when you're hooked on beating your high score. For those who love speedrunning, optimization, or competitive leaderboards, Snabbit's tight mechanics offer a real playground for mastery."
      },
      {
        title: "Final Verdict",
        icon: "✅",
        content: "Snabbit proves that simplicity is not a limitation, but a strength. It's a great example of mobile gaming done right — intuitive controls, engaging gameplay, and a fair level of challenge. Whether you're a casual player or a hardcore mobile gamer, Snabbit deserves a spot on your home screen. Rating: ★★★★☆ (4.5/5)"
      },
    ],
    rating: 4.5,
    related: [
      {
        id: "locarto",
        title: "Locarto",
        tagline: "India’s First Quick Service App",
      },
    ],
  },
  {
    id: "locarto",
    title: "Locarto",
    subtitle: "India’s First Quick Service App",
    description: "Connects users with trained professionals for various household tasks like cleaning, laundry, and dishwashing. Simple, fast, and reliable platform for home services.",
    image: imageUrls.locarto,
    sections: [
      {
        title: "What Is Locarto?",
        icon: "✨",
        content: "In a market saturated with generic service apps, Locarto emerges as a pioneer, offering a streamlined and efficient solution for everyday household needs. Designed with the busy urban Indian lifestyle in mind, Locarto connects users seamlessly with vetted, skilled professionals for a variety of essential tasks. From deep cleaning and laundry pickup to dishwashing and handyman services, Locarto transforms the chore of finding help into a simple, hassle-free experience. Its core philosophy revolves around speed, reliability, and quality — ensuring that users get exactly what they need, when they need it, without the usual headaches associated with booking services."
      },
      {
        title: "Service Experience: Effortless Booking, Guaranteed Quality",
        icon: "🎮",
        content: "Locarto excels by simplifying the entire service journey. Users can book a professional in just a few taps, choosing from a wide range of services tailored to their specific requirements. The app features transparent pricing, real-time tracking of your service provider, and detailed profiles including ratings and reviews. Professionals undergo a rigorous screening process to ensure competence and trustworthiness. The platform handles scheduling, payment, and even follow-up feedback, creating a frictionless experience. What makes Locarto stand out? A user-friendly interface that requires no learning curve; flexible scheduling options to fit any timeline; highly trained professionals available on-demand; and a robust customer support system that resolves issues swiftly."
      },
      {
        title: "Design & User Journey: Clarity Meets Convenience",
        icon: "🎨",
        content: "Locarto's interface is a testament to thoughtful design, prioritizing clarity and ease of use. The layout is intuitive, with clear categories and quick access to frequently used services. Visual cues guide users effortlessly through the booking process. The app uses a clean, modern aesthetic with a calming color scheme that reduces cognitive load. Notifications are timely and informative, keeping users updated without being intrusive. The overall user journey is smooth, from initial discovery to post-service feedback, making it accessible for tech-savvy users and newcomers alike."
      },
      {
        title: "Why You'll Keep Using Locarto",
        icon: "🔁",
        content: "Locarto fosters loyalty through consistent reliability and exceptional service. Once you experience the convenience of having a trusted professional arrive promptly to handle your chores, you’ll find it hard to go back to traditional methods. It's ideal for busy professionals juggling work and family, students managing tight schedules, or anyone seeking to reclaim time for what truly matters. The app's commitment to quality assurance and customer satisfaction ensures that every interaction reinforces trust. For those who value efficiency and peace of mind, Locarto becomes an indispensable part of daily life."
      },
      {
        title: "Final Verdict",
        icon: "✅",
        content: "Locarto isn’t just another service app; it’s a game-changer for urban living in India. By focusing on simplicity, speed, and superior service delivery, it sets a new standard for convenience. Its innovative approach to connecting users with skilled professionals addresses a genuine need in today’s fast-paced world. Whether you’re managing a hectic schedule or simply want to enjoy more free time, Locarto offers a reliable, high-quality solution that deserves a place on your device. Rating: ★★★★☆ (4.2/5)"
      },
    ],
    rating: 4.2,
    related: [
      {
        id: "snabbit",
        title: "Snabbit",
        tagline: "The Underrated Space Snake Game That Will Hook You Instantly",
      },
    ],
  },
  {
    id: "dummy1",
    title: "Nike",
    subtitle: "Just Do It",
    description: "Global leader in athletic footwear, apparel, and equipment.",
    image: imageUrls.dummy1,
    sections: [
      {
        title: "About Nike",
        icon: "✨",
        content: "Nike is an American multinational corporation that is engaged in the design, development, manufacturing, and worldwide marketing and sales of footwear, apparel, equipment, accessories, and services."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Innovation in sportswear, iconic Swoosh logo, and partnerships with world-class athletes make Nike a leader in athletic performance and style."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "Nike continues to set trends in athletic wear and inspire athletes worldwide with cutting-edge technology and design."
      }
    ],
    rating: 4.5,
    related: [
      {
        id: "dummy2",
        title: "Burberry",
        tagline: "British Luxury Fashion House",
      },
      {
        id: "dummy3",
        title: "Chanel",
        tagline: "French Luxury Fashion",
      },
    ],
  },
  {
    id: "dummy2",
    title: "Burberry",
    subtitle: "British Luxury Fashion House",
    description: "Renowned for its iconic check pattern and luxury goods.",
    image: imageUrls.dummy2,
    sections: [
      {
        title: "About Burberry",
        icon: "✨",
        content: "Burberry is a British luxury fashion house founded in 1856, known for its distinctive check pattern and high-quality outerwear."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Burberry combines heritage craftsmanship with contemporary design, creating timeless pieces for modern consumers."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "Burberry remains a symbol of British elegance and sophistication in the luxury fashion market."
      }
    ],
    rating: 4.7,
    related: [
      {
        id: "dummy1",
        title: "Nike",
        tagline: "Just Do It",
      },
      {
        id: "dummy4",
        title: "Levi's",
        tagline: "Original Jeans Brand",
      },
    ],
  },
  {
    id: "dummy3",
    title: "Chanel",
    subtitle: "French Luxury Fashion",
    description: "Iconic French fashion house known for timeless elegance.",
    image: imageUrls.dummy3,
    sections: [
      {
        title: "About Chanel",
        icon: "✨",
        content: "Founded by Gabrielle 'Coco' Chanel, this luxury brand is famous for its quilted handbags, classic suits, and No. 5 perfume."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Chanel represents luxury, femininity, and timeless style with iconic pieces that transcend seasonal trends."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "Chanel continues to define luxury fashion with its classic designs and innovative approach to women's style."
      }
    ],
    rating: 4.8,
    related: [
      {
        id: "dummy1",
        title: "Nike",
        tagline: "Just Do It",
      },
      {
        id: "dummy5",
        title: "Supreme",
        tagline: "Streetwear Culture Brand",
      },
    ],
  },
  {
    id: "dummy4",
    title: "Levi's",
    subtitle: "Original Jeans Brand",
    description: "Pioneer of blue jeans and denim clothing since 1853.",
    image: imageUrls.dummy4,
    sections: [
      {
        title: "About Levi's",
        icon: "✨",
        content: "Levi Strauss & Co. is an American clothing company known worldwide for its Levi's brand of denim jeans."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Levi's represents durability, quality, and authentic American style with a rich heritage in denim craftsmanship."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "Levi's remains the gold standard in denim, adapting to modern fashion while maintaining its classic appeal."
      }
    ],
    rating: 4.3,
    related: [
      {
        id: "dummy2",
        title: "Burberry",
        tagline: "British Luxury Fashion House",
      },
      {
        id: "dummy6",
        title: "The North Face",
        tagline: "Outdoor Recreation Products",
      },
    ],
  },
  {
    id: "dummy5",
    title: "Supreme",
    subtitle: "Streetwear Culture Brand",
    description: "Iconic skateboarding and streetwear brand from New York.",
    image: imageUrls.dummy5,
    sections: [
      {
        title: "About Supreme",
        icon: "✨",
        content: "Supreme is a New York-based skateboarding brand that has become a global phenomenon in streetwear culture."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Supreme combines skateboarding culture with high fashion, creating limited-edition pieces that are highly coveted."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "Supreme has redefined streetwear and continues to influence fashion and youth culture worldwide."
      }
    ],
    rating: 4.6,
    related: [
      {
        id: "dummy3",
        title: "Chanel",
        tagline: "French Luxury Fashion",
      },
      {
        id: "dummy1",
        title: "Nike",
        tagline: "Just Do It",
      },
    ],
  },
  {
    id: "dummy6",
    title: "The North Face",
    subtitle: "Outdoor Recreation Products",
    description: "Leading outdoor recreation clothing and equipment brand.",
    image: imageUrls.dummy6,
    sections: [
      {
        title: "About The North Face",
        icon: "✨",
        content: "The North Face is an American outdoor recreation company that manufactures outerwear, backpacks, and other equipment."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "The North Face provides high-performance outdoor gear designed for extreme conditions and adventurous activities."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "The North Face continues to inspire exploration and outdoor adventure with innovative, reliable products."
      }
    ],
    rating: 4.4,
    related: [
      {
        id: "dummy4",
        title: "Levi's",
        tagline: "Original Jeans Brand",
      },
      {
        id: "dummy2",
        title: "Burberry",
        tagline: "British Luxury Fashion House",
      },
    ],
  },
  {
    id: "dummy7",
    title: "Tommy Hilfiger",
    subtitle: "American Luxury Lifestyle Brand",
    description: "Global lifestyle brand featuring premium clothing and accessories.",
    image: imageUrls.dummy7,
    sections: [
      {
        title: "About Tommy Hilfiger",
        icon: "✨",
        content: "Tommy Hilfiger is an American multinational clothing company that designs and markets premium casual clothing."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Tommy Hilfiger represents classic American style with preppy designs and high-quality materials."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "Tommy Hilfiger continues to be a symbol of American luxury lifestyle with timeless designs."
      }
    ],
    rating: 4.2,
    related: [
      {
        id: "dummy5",
        title: "Supreme",
        tagline: "Streetwear Culture Brand",
      },
      {
        id: "dummy6",
        title: "The North Face",
        tagline: "Outdoor Recreation Products",
      },
    ],
  },
  {
    id: "dummy8", // 🆕 New brand: Jordan
    title: "Jordan",
    subtitle: "Flight. Legacy. Icon.",
    description: "Legendary basketball brand created by Michael Jordan, blending performance, style, and cultural impact.",
    image: imageUrls.dummy8, // This now points to jordanImg
    sections: [
      {
        title: "About Jordan",
        icon: "✨",
        content: "Jordan Brand, launched in 1997 under Nike, is synonymous with excellence in basketball and streetwear. Known for its Air Jordan sneakers, the brand has transcended sports to become a global cultural phenomenon."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Iconic silhouettes, performance innovation, and unmatched cultural relevance make Jordan Brand a must-have for athletes and sneakerheads alike."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "From the court to the streets, Jordan continues to redefine what it means to be legendary — in sport, fashion, and culture."
      }
    ],
    rating: 4.9,
    related: [
      {
        id: "dummy1",
        title: "Nike",
        tagline: "Just Do It",
      },
      {
        id: "adidas",
        title: "Adidas",
        tagline: "Impossible is Nothing",
      },
    ],
  },
  {
    id: "dummy9",
    title: "Adidas",
    subtitle: "Impossible is Nothing",
    description: "German multinational corporation that designs and manufactures sports shoes, clothing and accessories.",
    image: imageUrls.dummy9,
    sections: [
      {
        title: "About Adidas",
        icon: "✨",
        content: "Adidas AG is a German multinational corporation, founded in 1949, that designs and manufactures sports shoes, clothing and accessories. Known for its three-stripe logo, Adidas is one of the world's leading sportswear manufacturers."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Innovation in sportswear technology, iconic three-stripe design, and partnerships with top athletes make Adidas a leader in athletic performance and style."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "Adidas continues to push boundaries in athletic wear, combining performance with style to inspire athletes worldwide."
      }
    ],
    rating: 4.4,
    related: [
      {
        id: "dummy10",
        title: "Puma",
        tagline: "Forever Faster",
      },
      {
        id: "dummy1",
        title: "Nike",
        tagline: "Just Do It",
      },
    ],
  },
  {
    id: "dummy10",
    title: "Puma",
    subtitle: "Forever Faster",
    description: "German multinational corporation that designs and develops athletic and casual footwear, apparel and accessories.",
    image: imageUrls.dummy10,
    sections: [
      {
        title: "About Puma",
        icon: "✨",
        content: "PUMA SE is a German multinational corporation that designs and develops athletic and casual footwear, apparel and accessories. Founded in 1948, PUMA is known for its distinctive formstrip logo and focus on sports and lifestyle products."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Performance-driven designs, celebrity endorsements, and innovative technology make PUMA a top choice for athletes and fashion-conscious consumers."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "PUMA continues to blend sport performance with street fashion, setting trends in both athletic and lifestyle markets."
      }
    ],
    rating: 4.3,
    related: [
      {
        id: "dummy9",
        title: "Adidas",
        tagline: "Impossible is Nothing",
      },
      {
        id: "dummy1",
        title: "Nike",
        tagline: "Just Do It",
      },
    ],
  },
];

export default brandData;
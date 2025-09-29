// src/branddata.js

// URLs for dummy images
const imageUrls = {
  snabbit: "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_750,h_400/http://assets.designhill.com/design-blog/wp-content/uploads/2019/04/14.png",
  locarto: "https://www.edigitalagency.com.au/wp-content/uploads/Puma-logo-black-png-300x150.png",
  dummy1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVnjGhMxF8YY8yFxKeTUPv2BB9CRc--NtioA&s",
  dummy2: "https://assets.turbologo.ru/blog/ru/2021/11/12073500/Burberry-Logo.png",
  dummy3: "https://fabrikbrands.com/wp-content/uploads/Clothing-brand-logos-12-1200x750.png",
  dummy4: "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_750,h_400/http://assets.designhill.com/design-blog/wp-content/uploads/2019/04/9.png",
  dummy5: "https://assets.turbologo.ru/blog/ru/2019/12/18163325/3-poloski-adidas-logo.png",
  dummy6: "https://www.jetpunk.com/img/user-img/28/281719ca08-450.webp",
  dummy7: "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_750,h_400/https://assets.designhill.com/design-blog/wp-content/uploads/2019/04/26-min-1.jpg", // Added new URL
  // Add more URLs here if needed
};

const brandData = [
  {
    id: "snabbit",
    title: "Snabbit",
    subtitle: "The Underrated Space Snake Game That Will Hook You Instantly",
    description: "Fast, challenging space snake game with simple tap-to-switch gravity mechanics. Visually sleek, addictive gameplay combining classic snake with modern physics and side-scrolling action.",
    image: imageUrls.snabbit, // Use URL from object
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
    image: imageUrls.locarto, // Use URL from object
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
        content: "Locarto fosters loyalty through consistent reliability and exceptional service. Once you experience the convenience of having a trusted professional arrive promptly to handle your chores, you’ll find it hard to go back to traditional methods. It’s ideal for busy professionals juggling work and family, students managing tight schedules, or anyone seeking to reclaim time for what truly matters. The app’s commitment to quality assurance and customer satisfaction ensures that every interaction reinforces trust. For those who value efficiency and peace of mind, Locarto becomes an indispensable part of daily life."
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
    title: "Dummy Brand 1",
    subtitle: "Subtitle for Dummy Brand 1",
    description: "A brief description for Dummy Brand 1. This is a placeholder brand.",
    image: imageUrls.dummy1, // Use URL from object
    sections: [
      {
        title: "About Dummy Brand 1",
        icon: "✨",
        content: "This is a dummy section for Dummy Brand 1. It contains placeholder text to demonstrate the structure."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Another dummy section for Dummy Brand 1. This could detail features or benefits."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "A concluding dummy section for Dummy Brand 1. This might summarize the brand's value proposition."
      }
    ],
    rating: 3.8,
    related: [
      {
        id: "dummy2",
        title: "Dummy Brand 2",
        tagline: "Subtitle for Dummy Brand 2",
      },
      {
        id: "dummy3",
        title: "Dummy Brand 3",
        tagline: "Subtitle for Dummy Brand 3",
      },
    ],
  },
  {
    id: "dummy2",
    title: "Dummy Brand 2",
    subtitle: "Subtitle for Dummy Brand 2",
    description: "A brief description for Dummy Brand 2. This is a placeholder brand.",
    image: imageUrls.dummy2, // Use URL from object
    sections: [
      {
        title: "About Dummy Brand 2",
        icon: "✨",
        content: "This is a dummy section for Dummy Brand 2. It contains placeholder text to demonstrate the structure."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Another dummy section for Dummy Brand 2. This could detail features or benefits."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "A concluding dummy section for Dummy Brand 2. This might summarize the brand's value proposition."
      }
    ],
    rating: 4.0,
    related: [
      {
        id: "dummy1",
        title: "Dummy Brand 1",
        tagline: "Subtitle for Dummy Brand 1",
      },
      {
        id: "dummy4",
        title: "Dummy Brand 4",
        tagline: "Subtitle for Dummy Brand 4",
      },
    ],
  },
  {
    id: "dummy3",
    title: "Dummy Brand 3",
    subtitle: "Subtitle for Dummy Brand 3",
    description: "A brief description for Dummy Brand 3. This is a placeholder brand.",
    image: imageUrls.dummy3, // Use URL from object
    sections: [
      {
        title: "About Dummy Brand 3",
        icon: "✨",
        content: "This is a dummy section for Dummy Brand 3. It contains placeholder text to demonstrate the structure."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Another dummy section for Dummy Brand 3. This could detail features or benefits."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "A concluding dummy section for Dummy Brand 3. This might summarize the brand's value proposition."
      }
    ],
    rating: 3.5,
    related: [
      {
        id: "dummy1",
        title: "Dummy Brand 1",
        tagline: "Subtitle for Dummy Brand 1",
      },
      {
        id: "dummy5",
        title: "Dummy Brand 5",
        tagline: "Subtitle for Dummy Brand 5",
      },
    ],
  },
  {
    id: "dummy4",
    title: "Dummy Brand 4",
    subtitle: "Subtitle for Dummy Brand 4",
    description: "A brief description for Dummy Brand 4. This is a placeholder brand.",
    image: imageUrls.dummy4, // Use URL from object
    sections: [
      {
        title: "About Dummy Brand 4",
        icon: "✨",
        content: "This is a dummy section for Dummy Brand 4. It contains placeholder text to demonstrate the structure."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Another dummy section for Dummy Brand 4. This could detail features or benefits."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "A concluding dummy section for Dummy Brand 4. This might summarize the brand's value proposition."
      }
    ],
    rating: 4.1,
    related: [
      {
        id: "dummy2",
        title: "Dummy Brand 2",
        tagline: "Subtitle for Dummy Brand 2",
      },
      {
        id: "dummy6",
        title: "Dummy Brand 6",
        tagline: "Subtitle for Dummy Brand 6",
      },
    ],
  },
  {
    id: "dummy5",
    title: "Dummy Brand 5",
    subtitle: "Subtitle for Dummy Brand 5",
    description: "A brief description for Dummy Brand 5. This is a placeholder brand.",
    image: imageUrls.dummy5, // Use URL from object
    sections: [
      {
        title: "About Dummy Brand 5",
        icon: "✨",
        content: "This is a dummy section for Dummy Brand 5. It contains placeholder text to demonstrate the structure."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Another dummy section for Dummy Brand 5. This could detail features or benefits."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "A concluding dummy section for Dummy Brand 5. This might summarize the brand's value proposition."
      }
    ],
    rating: 3.9,
    related: [
      {
        id: "dummy3",
        title: "Dummy Brand 3",
        tagline: "Subtitle for Dummy Brand 3",
      },
      {
        id: "dummy1",
        title: "Dummy Brand 1",
        tagline: "Subtitle for Dummy Brand 1",
      },
    ],
  },
  {
    id: "dummy6",
    title: "Dummy Brand 6",
    subtitle: "Subtitle for Dummy Brand 6",
    description: "A brief description for Dummy Brand 6. This is a placeholder brand.",
    image: imageUrls.dummy6, // Use URL from object
    sections: [
      {
        title: "About Dummy Brand 6",
        icon: "✨",
        content: "This is a dummy section for Dummy Brand 6. It contains placeholder text to demonstrate the structure."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Another dummy section for Dummy Brand 6. This could detail features or benefits."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "A concluding dummy section for Dummy Brand 6. This might summarize the brand's value proposition."
      }
    ],
    rating: 4.3,
    related: [
      {
        id: "dummy4",
        title: "Dummy Brand 4",
        tagline: "Subtitle for Dummy Brand 4",
      },
      {
        id: "dummy2",
        title: "Dummy Brand 2",
        tagline: "Subtitle for Dummy Brand 2",
      },
    ],
  },
  {
    id: "dummy7", // Added new dummy brand
    title: "Dummy Brand 7",
    subtitle: "Subtitle for Dummy Brand 7",
    description: "A brief description for Dummy Brand 7. This is a placeholder brand using the new image URL.",
    image: imageUrls.dummy7, // Use the new URL from object
    sections: [
      {
        title: "About Dummy Brand 7",
        icon: "✨",
        content: "This is a dummy section for Dummy Brand 7. It contains placeholder text to demonstrate the structure."
      },
      {
        title: "Why Choose Us?",
        icon: "✅",
        content: "Another dummy section for Dummy Brand 7. This could detail features or benefits."
      },
      {
        title: "Final Thoughts",
        icon: "💭",
        content: "A concluding dummy section for Dummy Brand 7. This might summarize the brand's value proposition."
      }
    ],
    rating: 4.0,
    related: [
      {
        id: "dummy5",
        title: "Dummy Brand 5",
        tagline: "Subtitle for Dummy Brand 5",
      },
      {
        id: "dummy6",
        title: "Dummy Brand 6",
        tagline: "Subtitle for Dummy Brand 6",
      },
    ],
  },
];

export default brandData;
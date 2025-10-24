export const welcomeMsgs = [
  "Step into the street where brands still have an address.",
  "Commerce just got personal — and you’re at the center of it.",
  "Your map to what’s real and remarkable starts here.",
  "Every tag here tells a story. Let’s find yours.",
  "Trade flows here 24/7, just like ambition.",
  "The tag never lies. Explore what’s truly authentic.",
  "Real people. Real places. Real brands. That’s LOCARTO.",
  "Consider this your digital stroll through India’s business streets.",
  "This isn’t shopping. It’s discovery.",
  "Every product here has a pin on the map — find your favorite coordinates.",
  "You’ve arrived — where commerce meets conviction.",
  "Trade just got transparent.",
  "The marketplace with a soul awaits.",
  "You’re not browsing — you’re exploring origins.",
  "Authentic finds only — no filters, no fakes.",
  "From local streets to your screen — LOCARTO connects real commerce.",
  "Every tag here means trust.",
  "Let’s make your cart a story.",
  "You’re not scrolling a warehouse — you’re walking through real commerce.",
  "Let’s tag some authenticity today.",
  "Discover brands that don’t just sell — they belong.",
  "Authenticity, assurance, adaptability — and you.",
  "Commerce just found its rhythm again.",
  "The future of marketplaces — powered by AI, rooted in reality.",
  "Think less algorithm, more artisan.",
  "Every tag is a promise — start unboxing trust.",
  "This isn’t “add to cart.” It’s “add to culture.”",
  "We’ve mapped authenticity for you.",
  "Explore the living map of Indian D2C brands.",
  "You bring curiosity — we’ll bring real commerce to match.",
];

export const getRandomMsg = () => {
  let randomMsg = welcomeMsgs[Math.floor(Math.random() * welcomeMsgs.length)];
  return randomMsg;
};

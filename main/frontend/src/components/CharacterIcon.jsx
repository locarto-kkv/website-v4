// src/components/CharacterIcon.jsx
import React from "react";

const CharacterIcon = () => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Background */}
      <rect width="100" height="100" fill="none" />
      
      {/* Head */}
      <circle cx="50" cy="30" r="15" fill="#000" />
      
      {/* Glasses */}
      <rect x="40" y="32" width="20" height="5" rx="2" fill="#fff" />
      <rect x="40" y="32" width="20" height="5" rx="2" stroke="#000" strokeWidth="2" fill="none" />
      <rect x="45" y="37" width="10" height="5" rx="2" fill="#fff" />
      <rect x="45" y="37" width="10" height="5" rx="2" stroke="#000" strokeWidth="2" fill="none" />
      
      {/* Body */}
      <rect x="30" y="45" width="40" height="50" rx="10" fill="#000" />
      
      {/* Arms */}
      <rect x="25" y="55" width="10" height="30" rx="5" fill="#000" />
      <rect x="65" y="55" width="10" height="30" rx="5" fill="#000" />
      
      {/* Hand holding magnifier */}
      <rect x="45" y="65" width="10" height="15" rx="5" fill="#000" />
      <rect x="50" y="70" width="5" height="10" rx="2" fill="#000" />
      
      {/* Magnifier */}
      <ellipse cx="65" cy="75" rx="15" ry="10" fill="#fff" stroke="#000" strokeWidth="2" />
      <rect x="60" y="70" width="10" height="10" rx="2" fill="#000" />
    </svg>
  );
};

export default CharacterIcon;
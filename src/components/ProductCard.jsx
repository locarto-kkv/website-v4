import React from 'react';

const ProductCard = ({ title, price, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 product-card">
      <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-primary font-semibold">${price}</p>
      <button className="mt-3 w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
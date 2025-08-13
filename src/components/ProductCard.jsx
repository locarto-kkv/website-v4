import React from 'react';

const ProductCard = ({ title, price, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-3 product-card">
      <div className="bg-gray-200 h-32 rounded-lg mb-3"></div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-primary font-semibold text-lg">${price}</p>
      <button className="mt-2 w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition text-sm">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
import React from 'react';

const TopSellingProducts = () => {
  // This is currently static data.
  // You would typically fetch this data from an API.
  const topProducts = [
    { name: "Wireless Headphones", sold: 120 },
    { name: "Smart Watch", sold: 98 },
    { name: "Bluetooth Speaker", sold: 76 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-secondary mb-6">
        Top Selling Products
      </h2>
      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div key={index} className="flex items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4">
              {/* You can add an <img /> tag here for product images */}
            </div>
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.sold} sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
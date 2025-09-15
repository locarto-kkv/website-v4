import React from 'react';

const StatCard = ({ title, value, iconClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-md dashboard-card border-l-4 border-primary">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-600">{title}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
      </div>
      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
        <i className={`${iconClass} text-primary text-xl`}></i>
      </div>
    </div>
  </div>
);

const DashboardStats = ({ products, orders }) => {
  const totalRevenue = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Products" value={products.length || 0} iconClass="fas fa-box" />
      <StatCard title="Total Orders" value={orders.length || 0} iconClass="fas fa-shopping-cart" />
      <StatCard title="Total Revenue" value={`Rs. ${totalRevenue}`} iconClass="fas fa-dollar-sign" />
    </div>
  );
};

export default DashboardStats;
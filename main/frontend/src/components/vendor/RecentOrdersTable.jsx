import React from 'react';

const RecentOrdersTable = ({ orders }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-secondary">Recent Orders</h2>
        <a href="#" className="text-primary hover:underline">View All</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 text-gray-600 font-medium">Order ID</th>
              <th className="text-left py-3 text-gray-600 font-medium">Product</th>
              <th className="text-left py-3 text-gray-600 font-medium">Status</th>
              <th className="text-left py-3 text-gray-600 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-4">{order.id}</td>
                <td className="py-4">{order.product?.name}</td>
                <td className="py-4">
                  <span className="font-medium px-2.5 py-0.5 rounded-full">
                    {order.order_status}
                  </span>
                </td>
                <td className="py-4">Rs. {order.transaction?.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
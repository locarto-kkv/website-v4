// src/pages/consumer/dashboard/CustomerOverview.jsx
import { useNavigate } from "react-router-dom";
import { useConsumerData } from "../../../context/consumer/consumerDataContext"; // Adjust path if needed

// Mock StatCard component (replace with actual import if you have it)
const StatCard = ({ title, value, icon, gradient, trend, trendValue }) => (
  <div className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">
    <div
      className={`absolute top-0 left-0 w-full h-1 ${gradient} rounded-t-2xl`}
    ></div>
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
          {title}
        </p>
        <div className="flex items-baseline gap-2 mt-3">
          <h3 className="text-3xl font-black text-gray-900">{value}</h3>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                trend === "up"
                  ? "bg-green-100 text-green-800"
                  : trend === "down"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <i
                className={`fas fa-arrow-${
                  trend === "up" ? "up" : "down"
                } text-xs`}
              ></i>
              {trendValue}
            </div>
          )}
        </div>
      </div>
      <div
        className={`relative w-14 h-14 ${gradient} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}
      >
        <i className={`${icon} text-white text-xl drop-shadow-sm`}></i>
      </div>
    </div>
  </div>
);


const CustomerOverview = () => {
  const navigate = useNavigate();
  // Get orders AND lists data from context
  const { orders, lists } = useConsumerData(); // <-- Added 'lists'

  // Filter pending orders (based on original logic)
  const pendingOrders = (orders || []).filter(
    (o) => o.status === "pending" || o.status === "shipped"
  ); //

  // --- Mock Data (Replace or remove if context provides this) ---
  // You might already have this logic or data in your context or fetched elsewhere
  const mockRecommendations = [
    { id: 1, name: "Recommended Product 1", price: 999 },
    { id: 2, name: "Recommended Product 2", price: 1998 },
    { id: 3, name: "Recommended Product 3", price: 2997 },
  ]; //
  // --- End Mock Data ---

  // Calculate Total Spent (keep if needed elsewhere, otherwise remove)
  // const totalSpent = (orders || []).reduce(
  //   (sum, o) => sum + (o.product?.price || 0) * (o.quantity || 0),
  //   0
  // );

  // **NEW: Calculate Wishlist Count**
  // Use optional chaining and nullish coalescing for safety
  const wishlistCount = lists?.wishlist?.size ?? 0; // Get the size of the Set


  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value={orders?.length || 0}
          icon="fas fa-shopping-bag"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        /> {/* */}
        <StatCard
          title="Pending Orders"
          value={pendingOrders.length}
          icon="fas fa-clock"
          gradient="bg-gradient-to-br from-orange-500 to-red-500"
        /> {/* */}
        {/* **MODIFIED StatCard: Replaced Total Spent with Wishlist Count** */}
        <StatCard
          title="Items in Wishlist" // New Title
          value={wishlistCount} // New Value
          icon="fas fa-heart" // New Icon
          gradient="bg-gradient-to-br from-pink-500 to-purple-600" // New Gradient (Example)
        /> {/* */}
         {/* **END MODIFICATION** */}
      </div>

      {/* Recommendations & Pending Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-sparkles text-orange-500"></i>
              Recommended for You
            </h2>
          </div>
          <div className="space-y-4">
            {mockRecommendations.map(
              (
                rec // Use mock data here
              ) => (
                <div
                  key={rec.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>{" "}
                  {/* Placeholder image */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{rec.name}</h3>
                    <p className="text-orange-500 font-bold">₹{rec.price}</p>
                  </div>
                  <button className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all">
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              )
            )} {/* */}
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-clock text-orange-500"></i>
              Pending Orders
            </h2>
            <button
              onClick={() => navigate("/consumer/dashboard/orders")} // Navigate to the Orders page
              className="text-orange-500 hover:text-orange-600 font-semibold text-sm"
            >
              View All
            </button> {/* */}
          </div>
          <div className="space-y-4">
            {pendingOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-check-circle text-4xl mb-2 text-green-500"></i>
                <p>No pending orders</p>
              </div>
            ) : (
              pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={
                        order.product?.image ||
                        "https://via.placeholder.com/100"
                      }
                      alt={order.product?.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {order.product?.name || "Product Name"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))
            )} {/* */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;
// src/components/vendor/DashboardStats.jsx
import { formatCurrency } from "../../lib/utils.js";
import { useNavigate } from "react-router-dom";

// This card component is used to display key metrics.
const StatCard = ({ title, value, iconClass, trend, trendValue, gradient }) => (
  <div className="group relative bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">
    {/* Gradient border accent */}
    <div
      className={`absolute top-0 left-0 w-full h-1 ${gradient} rounded-t-2xl`}
    ></div>

    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wide">
          {title}
        </p>
        <div className="flex items-baseline gap-2 mt-2 sm:mt-3">
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{value}</h3>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                trend === "up"
                  ? "bg-green-100 text-green-800"
                  : trend === "down"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <i
                className={`fas fa-arrow-${
                  trend === "up" ? "up" : trend === "down" ? "down" : "right"
                } text-[10px] sm:text-xs`}
              ></i>
              {trendValue}
            </div>
          )}
        </div>
      </div>

      {/* Icon with gradient background */}
      <div
        className={`relative w-10 h-10 sm:w-14 sm:h-14 ${gradient} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 flex-shrink-0`}
      >
        <i className={`${iconClass} text-white text-base sm:text-xl drop-shadow-sm`}></i>
      </div>
    </div>
  </div>
);

const DashboardStats = ({ products = [], vendor = {} }) => { // Default vendor to {}
  const navigate = useNavigate();

  const totalRevenue = vendor.total_amount || 0;

  // Formats large numbers into K (thousands) or M (millions)
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  // Mock trend data
  const getTrendData = (type) => {
    const trends = {
      products: { trend: "up", percent: "+12%" },
      vendor: { trend: "up", percent: "+8.5%" },
      revenue: { trend: "up", percent: "+15.2%" },
    };
    return trends[type] || {};
  };

  const statsData = [
    {
      title: "Total Products",
      value: formatNumber(vendor.products_count),
      iconClass: "fas fa-cube",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      ...getTrendData("products"),
    },
    {
      title: "Total Orders",
      value: formatNumber(vendor.orders_count),
      iconClass: "fas fa-shopping-bag",
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
      ...getTrendData("vendor"),
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      iconClass: "fas fa-chart-line",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
      ...getTrendData("revenue"),
    },
  ];

  // Quick Actions configuration
  const quickActions = [
    { label: "Add Product", icon: "fas fa-plus", color: "bg-blue-500", path: "/vendor/products" },
    { label: "View Orders", icon: "fas fa-list", color: "bg-green-500", path: "/vendor/orders" },
    { label: "Analytics", icon: "fas fa-chart-bar", color: "bg-purple-500", path: "/vendor/analytics" },
    { label: "Settings", icon: "fas fa-cog", color: "bg-gray-500", path: "/vendor/settings" },
  ];


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid: Stacks to 1 column on mobile, 2 on medium, 3 on xl screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            iconClass={stat.iconClass}
            trend={stat.trend}
            trendValue={stat.percent}
            gradient={stat.gradient}
          />
        ))}
      </div>

      {/* Quick Actions: Responsive padding and grid columns */}
      <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        {/* Grid has 2 columns on mobile and 4 on medium screens and up */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200 group"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
              >
                <i className={`${action.icon} text-white text-xs sm:text-sm`}></i>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900 text-center">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;


const StatCard = ({ title, value, iconClass, trend, trendValue, gradient }) => (
  <div className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">
    {/* Gradient border accent */}
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
                  trend === "up" ? "up" : trend === "down" ? "down" : "right"
                } text-xs`}
              ></i>
              {trendValue}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced icon with gradient background */}
      <div
        className={`relative w-14 h-14 ${gradient} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}
      >
        <i className={`${iconClass} text-white text-xl drop-shadow-sm`}></i>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>

    {/* Hover effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
  </div>
);

const DashboardStats = ({ products = [], orders = [] }) => {
  // Enhanced calculations with error handling
  const totalRevenue = orders.total_amount || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  // Mock trend data - in real app this would come from props or API
  const getTrendData = (type) => {
    const trends = {
      products: { trend: "up", value: "+12%" },
      orders: { trend: "up", value: "+8.5%" },
      revenue: { trend: "up", value: "+15.2%" },
    };
    return trends[type] || {};
  };

  const statsData = [
    {
      title: "Total Products",
      value: formatNumber(products.products_count),
      iconClass: "fas fa-cube",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      ...getTrendData("products"),
    },
    {
      title: "Total Orders",
      value: formatNumber(orders.orders_count),
      iconClass: "fas fa-shopping-bag",
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
      ...getTrendData("orders"),
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      iconClass: "fas fa-chart-line",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
      ...getTrendData("revenue"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-1">
            Track your business performance at a glance
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium">
          <i className="fas fa-sync-alt text-xs"></i>
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            iconClass={stat.iconClass}
            trend={stat.trend}
            trendValue={stat.trendValue}
            gradient={stat.gradient}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Add Product", icon: "fas fa-plus", color: "bg-blue-500" },
            {
              label: "View Orders",
              icon: "fas fa-list",
              color: "bg-green-500",
            },
            {
              label: "Analytics",
              icon: "fas fa-chart-bar",
              color: "bg-purple-500",
            },
            { label: "Settings", icon: "fas fa-cog", color: "bg-gray-500" },
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200 group"
            >
              <div
                className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
              >
                <i className={`${action.icon} text-white text-sm`}></i>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
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

import { useState, useEffect } from "react";
import { useVendorData } from "../../../context/vendor/vendorDataContext";

const VendorAnalytics = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [viewMode, setViewMode] = useState("chart");
  const [timePeriod, setTimePeriod] = useState("month");
  const { products, vendor, analyticData } = useVendorData();

  function transformToMonthlyData(data, valueKey) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // initialize all months with 0
    const monthlyData = months.map((m) => ({ month: m, value: 0 }));

    if (!data?.vendors?.monthly) return monthlyData;

    data.vendors.monthly.forEach((entry) => {
      const date = new Date(entry.order_month);
      const monthIndex = date.getUTCMonth(); // 0 = Jan, 11 = Dec
      monthlyData[monthIndex].value += entry[valueKey] || 0;
    });

    return monthlyData;
  }

  function getWeekNumber(dateString) {
    const date = new Date(dateString);
    const firstDayOfYear = new Date(date.getUTCFullYear(), 0, 1);
    const pastDaysOfYear = Math.floor((date - firstDayOfYear) / 86400000);
    return Math.floor(pastDaysOfYear / 7); // week index 0–52
  }

  function transformToWeeklySales(data, valueKey) {
    if (!data?.vendors?.weekly) return [];

    return data.vendors.weekly.map((entry) => {
      return {
        week: getWeekNumber(entry.order_week),
        sales: entry[valueKey] || 0,
      };
    });
  }

  const salesData = {
    title:
      timePeriod === "month"
        ? "Monthly Sales Performance"
        : "Weekly Sales Performance",
    metrics: [
      {
        label: "Total Revenue",
        value: vendor.total_amount || 0,
        change: "+12%",
        positive: true,
        icon: "fas fa-rupee-sign",
        color: "from-green-500 to-emerald-600",
      },
      {
        label: "Avg. Order Value",
        value: vendor.average_amount || 0,
        change: "-3.2%",
        positive: false,
        icon: "fas fa-calculator",
        color: "from-blue-500 to-indigo-600",
      },
      {
        label: "Total Orders",
        value: vendor.orders_count || 0,
        change: "+8%",
        positive: true,
        icon: "fas fa-shopping-cart",
        color: "from-purple-500 to-violet-600",
      },
      {
        label: "Conversion Rate",
        value: "2.5%",
        change: "+0.5%",
        positive: true,
        icon: "fas fa-percentage",
        color: "from-orange-500 to-red-500",
      },
    ],
    chartData:
      timePeriod === "month"
        ? transformToMonthlyData(analyticData, "total_amount")
        : transformToWeeklySales(analyticData, "total_amount"),
    insights: [
      {
        title: "Best Day for Sales",
        value: "Wednesday",
        type: "amber",
        icon: "fas fa-calendar-day",
        description: "Peak sales day of the week",
      },
      {
        title: "Top Performing Product",
        value: "Smartwatch Pro",
        type: "blue",
        icon: "fas fa-trophy",
        description: "Highest revenue generator",
      },
      {
        title: "Customer Growth Trend",
        value: "Positive",
        type: "emerald",
        trend: true,
        icon: "fas fa-chart-line",
        description: "15% increase in new customers",
      },
    ],
  };

  const ordersData = {
    title:
      timePeriod === "month"
        ? "Monthly Order Frequency"
        : "Weekly Order Frequency",
    metrics: [
      {
        label: "Total Orders",
        value: vendor.orders_count || 0,
        change: "+8%",
        positive: true,
        icon: "fas fa-box",
        color: "from-blue-500 to-cyan-600",
      },
      {
        label: "Pending Orders",
        value: vendor.order_status_counts?.pending || 0,
        change: "-5%",
        positive: true,
        icon: "fas fa-clock",
        color: "from-yellow-500 to-orange-500",
      },
      {
        label: "Completed Orders",
        value: vendor.order_status_counts?.complete || 0,
        change: "+12%",
        positive: true,
        icon: "fas fa-check-circle",
        color: "from-green-500 to-emerald-600",
      },
      {
        label: "Cancelled Orders",
        value: vendor.order_status_counts?.cancelled || 0,
        change: "-3%",
        positive: true,
        icon: "fas fa-times-circle",
        color: "from-red-500 to-rose-600",
      },
    ],
    chartData:
      timePeriod === "month"
        ? transformToMonthlyData(analyticData, "orders_count")
        : transformToWeeklySales(analyticData, "orders_count"),
    insights: [
      {
        title: "Peak Order Day",
        value: "Friday",
        type: "amber",
        icon: "fas fa-calendar-star",
        description: "Highest order volume day",
      },
      {
        title: "Most Popular Category",
        value: "Electronics",
        type: "blue",
        icon: "fas fa-microchip",
        description: "62% of total orders",
      },
      {
        title: "Order Completion Rate",
        value: "92%",
        type: "emerald",
        icon: "fas fa-chart-pie",
        description: "Excellent fulfillment rate",
      },
    ],
  };

  const customersData = {
    title: "Customer Demographics by Location",
    metrics: [
      {
        label: "Total Customers",
        value: "3,241",
        change: "+15%",
        positive: true,
        icon: "fas fa-users",
        color: "from-purple-500 to-indigo-600",
      },
      {
        label: "New Customers",
        value: "428",
        change: "+12%",
        positive: true,
        icon: "fas fa-user-plus",
        color: "from-green-500 to-emerald-600",
      },
      {
        label: "Returning Customers",
        value: "1,876",
        change: "+8%",
        positive: true,
        icon: "fas fa-user-check",
        color: "from-blue-500 to-cyan-600",
      },
      {
        label: "Customer Retention",
        value: "68%",
        change: "+3%",
        positive: true,
        icon: "fas fa-heart",
        color: "from-pink-500 to-rose-600",
      },
    ],
    chartData:
      timePeriod === "month"
        ? transformToMonthlyData(analyticData, "consumers_count")
        : transformToWeeklySales(analyticData, "consumers_count"),
    insights: [
      {
        title: "Highest Traffic Day",
        value: "Saturday",
        type: "amber",
        icon: "fas fa-calendar-week",
        description: "Peak customer activity",
      },
      {
        title: "Top Demographic",
        value: "25-34 years",
        type: "blue",
        icon: "fas fa-users",
        description: "Primary customer segment",
      },
      {
        title: "Average Customer Lifetime",
        value: "14 months",
        type: "emerald",
        icon: "fas fa-clock",
        description: "Strong customer loyalty",
      },
    ],
  };

  const productsData = {
    title: "Top Selling Products",
    metrics: [
      {
        label: "Total Products",
        value: "142",
        change: "+5%",
        positive: true,
        icon: "fas fa-boxes",
        color: "from-indigo-500 to-purple-600",
      },
      {
        label: "Top Seller",
        value: "Smartwatch Pro",
        change: "245 sold",
        positive: true,
        icon: "fas fa-crown",
        color: "from-yellow-500 to-orange-500",
      },
      {
        label: "Low Stock Items",
        value: "18",
        change: "-3",
        positive: false,
        icon: "fas fa-exclamation-triangle",
        color: "from-red-500 to-rose-600",
      },
      {
        label: "New This Month",
        value: "12",
        change: "+4",
        positive: true,
        icon: "fas fa-plus-circle",
        color: "from-green-500 to-emerald-600",
      },
    ],
    chartData: [
      { month: "Jan", value: 80 },
      { month: "Feb", value: 90 },
      { month: "Mar", value: 100 },
      { month: "Apr", value: 120 },
      { month: "May", value: 140 },
      { month: "Jun", value: 160 },
      { month: "Jul", value: 180 },
      { month: "Aug", value: 200 },
      { month: "Sep", value: 190 },
      { month: "Oct", value: 180 },
      { month: "Nov", value: 170 },
      { month: "Dec", value: 160 },
    ],
    insights: [
      {
        title: "Best Selling Category",
        value: "Wearables",
        type: "amber",
        icon: "fas fa-watch",
        description: "Leading product category",
      },
      {
        title: "Highest Rated Product",
        value: "Wireless Headphones",
        type: "blue",
        icon: "fas fa-star",
        description: "4.9/5 customer rating",
      },
      {
        title: "Inventory Status",
        value: "Healthy",
        type: "emerald",
        icon: "fas fa-warehouse",
        description: "Well-stocked inventory",
      },
    ],
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "orders":
        return ordersData;
      case "customers":
        return customersData;
      case "products":
        return productsData;
      default:
        return salesData;
    }
  };

  const currentData = getCurrentData();

  // Generate chart points for line chart
  const generateChartPoints = (data) => {
    const maxValue = Math.max(...data.map((item) => item.value));
    const minValue = Math.min(...data.map((item) => item.value));
    const range = maxValue - minValue || 1;
    const width = 400;
    const height = 200;
    const padding = 20;

    return data
      .map((item, index) => {
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
        const y =
          padding + ((maxValue - item.value) / range) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Generate area points for filled area under curve
  const generateAreaPoints = (data) => {
    const points = generateChartPoints(data);
    const width = 400;
    const height = 200;
    const padding = 20;
    return `${padding},${height - padding} ${points} ${width - padding},${
      height - padding
    }`;
  };

  const timeRanges = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "total", label: "Total" },
  ];

  const tabConfig = {
    sales: {
      icon: "fas fa-chart-line",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    orders: {
      icon: "fas fa-shopping-cart",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    customers: {
      icon: "fas fa-users",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    products: {
      icon: "fas fa-box",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-chart-bar text-white"></i>
            </div>
            Vendor Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your business performance
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          {/* Time Range Selector */}
          <select
            onChange={(e) => setTimePeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-medium"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
            <i className="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="flex overflow-x-auto">
          {Object.entries(tabConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-200 min-w-0 flex-shrink-0 border-b-2 ${
                activeTab === key
                  ? `${config.color} ${config.bgColor} border-current`
                  : "text-gray-600 hover:text-gray-800 border-transparent hover:bg-gray-50"
              }`}
            >
              <i className={`${config.icon} text-lg`}></i>
              <span className="capitalize">{key}</span>
              {activeTab === key && (
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {currentData.metrics.map((metric, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Gradient Background */}
            <div
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${metric.color} rounded-t-2xl`}
            ></div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <i className={`${metric.icon} text-white text-lg`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {metric.label}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-3xl font-black text-gray-900">
                    {metric.value}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    metric.positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <div
                    className={`p-1 rounded-full ${
                      metric.positive ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <i
                      className={`fas fa-arrow-${
                        metric.positive ? "up" : "down"
                      } text-xs`}
                    ></i>
                  </div>
                  <span>{metric.change} vs last month</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Enhanced Chart Section */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentData.title}
              </h2>
              <p className="text-gray-600 text-sm">
                Performance trends over time
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("chart")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "chart"
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <i className="fas fa-chart-line"></i>
              </button>
              <button
                onClick={() => setViewMode("bar")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "bar"
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <i className="fas fa-chart-bar"></i>
              </button>
            </div>
          </div>

          <div className="relative h-80 w-full bg-gradient-to-t from-gray-50 to-transparent rounded-xl p-4">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Enhanced Grid */}
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 20"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                  />
                </pattern>
                <linearGradient
                  id="areaGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Area under the line */}
              <polygon
                fill="url(#areaGradient)"
                points={generateAreaPoints(currentData.chartData)}
              />

              {/* Enhanced line chart */}
              <polyline
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={generateChartPoints(currentData.chartData)}
                className="transition-all duration-500 filter drop-shadow-sm"
              />

              {/* Enhanced data points */}
              {currentData.chartData.map((point, index) => {
                const maxValue = Math.max(
                  ...currentData.chartData.map((item) => item.value)
                );
                const minValue = Math.min(
                  ...currentData.chartData.map((item) => item.value)
                );
                const range = maxValue - minValue || 1;
                const width = 400;
                const height = 200;
                const padding = 20;
                const x =
                  padding +
                  (index * (width - 2 * padding)) /
                    (currentData.chartData.length - 1);
                const y =
                  padding +
                  ((maxValue - point.value) / range) * (height - 2 * padding);

                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="white"
                      stroke="#f97316"
                      strokeWidth="3"
                      className="transition-all duration-300 hover:r-8 cursor-pointer filter drop-shadow-sm"
                    />
                    <circle cx={x} cy={y} r="2" fill="#f97316" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Enhanced X-axis labels */}
          <div className="grid grid-cols-12 gap-2 mt-4 text-xs font-medium text-gray-500">
            {currentData.chartData.map((point, index) => (
              <div key={index} className="text-center">
                {point.month}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Insights Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-lightbulb text-white text-sm"></i>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Quick Insights</h2>
          </div>

          <div className="space-y-4 mb-8">
            {currentData.insights.map((insight, index) => (
              <div
                key={index}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  insight.type === "amber"
                    ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-300"
                    : insight.type === "blue"
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
                    : "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      insight.type === "amber"
                        ? "bg-amber-500 text-white"
                        : insight.type === "blue"
                        ? "bg-blue-500 text-white"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    <i className={`${insight.icon} text-sm`}></i>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-gray-800 font-medium mb-1">
                      {insight.value}
                    </p>
                    <p className="text-xs text-gray-600">
                      {insight.description}
                    </p>
                  </div>
                </div>

                {insight.trend && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <i className="fas fa-download"></i>
              Download Full Report
            </button>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300">
              <i className="fas fa-share-alt"></i>
              Share Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;

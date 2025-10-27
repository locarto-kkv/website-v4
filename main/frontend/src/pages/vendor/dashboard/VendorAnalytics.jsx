// src/pages/vendor/dashboard/VendorAnalytics.jsx
import { useState, useEffect } from "react";
import { useVendorData } from "../../../context/vendor/vendorDataContext";

const VendorAnalytics = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [viewMode, setViewMode] = useState("chart");
  const [timePeriod, setTimePeriod] = useState("month");
  const { products, vendor, analyticData } = useVendorData();

  // --- Data Transformation Functions --- (Keep existing functions: transformToMonthlyData, getWeekNumber, transformToWeeklySales)
  function transformToMonthlyData(data, valueKey) { //
    const months = [ //
      "Jan", //
      "Feb", //
      "Mar", //
      "Apr", //
      "May", //
      "Jun", //
      "Jul", //
      "Aug", //
      "Sep", //
      "Oct", //
      "Nov", //
      "Dec", //
    ]; //

    // initialize all months with 0
    const monthlyData = months.map((m) => ({ month: m, value: 0 })); //

    if (!data?.vendors?.monthly) return monthlyData; //

    data.vendors.monthly.forEach((entry) => { //
      const date = new Date(entry.order_month); //
      const monthIndex = date.getUTCMonth(); // 0 = Jan, 11 = Dec //
      monthlyData[monthIndex].value += entry[valueKey] || 0; //
    }); //

    return monthlyData; //
  } //

  function getWeekNumber(dateString) { //
    const date = new Date(dateString); //
    const firstDayOfYear = new Date(date.getUTCFullYear(), 0, 1); //
    const pastDaysOfYear = Math.floor((date - firstDayOfYear) / 86400000); //
    return Math.floor(pastDaysOfYear / 7); // week index 0–52 //
  } //

  function transformToWeeklySales(data, valueKey) { //
    if (!data?.vendors?.weekly) return []; //

    return data.vendors.weekly.map((entry) => { //
      return { //
        week: getWeekNumber(entry.order_week), //
        sales: entry[valueKey] || 0, //
      }; //
    }); //
  } //
  // --- End Data Transformation Functions ---

  // --- Data Definitions (salesData, ordersData, customersData, productsData) --- (Keep existing data structures)
    const salesData = { //
    title: //
      timePeriod === "month" //
        ? "Monthly Sales Performance" //
        : "Weekly Sales Performance", //
    metrics: [ //
      { //
        label: "Total Revenue", //
        value: vendor.total_amount || 0, //
        change: "+12%", //
        positive: true, //
        icon: "fas fa-rupee-sign", //
        color: "from-green-500 to-emerald-600", //
      }, //
      { //
        label: "Avg. Order Value", //
        value: vendor.average_amount || 0, //
        change: "-3.2%", //
        positive: false, //
        icon: "fas fa-calculator", //
        color: "from-blue-500 to-indigo-600", //
      }, //
      { //
        label: "Total Orders", //
        value: vendor.orders_count || 0, //
        change: "+8%", //
        positive: true, //
        icon: "fas fa-shopping-cart", //
        color: "from-purple-500 to-violet-600", //
      }, //
      { //
        label: "Conversion Rate", //
        value: "2.5%", //
        change: "+0.5%", //
        positive: true, //
        icon: "fas fa-percentage", //
        color: "from-orange-500 to-red-500", //
      }, //
    ], //
    chartData: //
      timePeriod === "month" //
        ? transformToMonthlyData(analyticData, "total_amount") //
        : transformToWeeklySales(analyticData, "total_amount"), //
    insights: [ //
      { //
        title: "Best Day for Sales", //
        value: "Wednesday", //
        type: "amber", //
        icon: "fas fa-calendar-day", //
        description: "Peak sales day of the week", //
      }, //
      { //
        title: "Top Performing Product", //
        value: "Smartwatch Pro", //
        type: "blue", //
        icon: "fas fa-trophy", //
        description: "Highest revenue generator", //
      }, //
      { //
        title: "Customer Growth Trend", //
        value: "Positive", //
        type: "emerald", //
        trend: true, //
        icon: "fas fa-chart-line", //
        description: "15% increase in new customers", //
      }, //
    ], //
  }; //

  const ordersData = { //
    title: //
      timePeriod === "month" //
        ? "Monthly Order Frequency" //
        : "Weekly Order Frequency", //
    metrics: [ //
      { //
        label: "Total Orders", //
        value: vendor.orders_count || 0, //
        change: "+8%", //
        positive: true, //
        icon: "fas fa-box", //
        color: "from-blue-500 to-cyan-600", //
      }, //
      { //
        label: "Pending Orders", //
        value: vendor.order_status_counts?.pending || 0, //
        change: "-5%", //
        positive: true, //
        icon: "fas fa-clock", //
        color: "from-yellow-500 to-orange-500", //
      }, //
      { //
        label: "Completed Orders", //
        value: vendor.order_status_counts?.complete || 0, //
        change: "+12%", //
        positive: true, //
        icon: "fas fa-check-circle", //
        color: "from-green-500 to-emerald-600", //
      }, //
      { //
        label: "Cancelled Orders", //
        value: vendor.order_status_counts?.cancelled || 0, //
        change: "-3%", //
        positive: true, //
        icon: "fas fa-times-circle", //
        color: "from-red-500 to-rose-600", //
      }, //
    ], //
    chartData: //
      timePeriod === "month" //
        ? transformToMonthlyData(analyticData, "orders_count") //
        : transformToWeeklySales(analyticData, "orders_count"), //
    insights: [ //
      { //
        title: "Peak Order Day", //
        value: "Friday", //
        type: "amber", //
        icon: "fas fa-calendar-star", //
        description: "Highest order volume day", //
      }, //
      { //
        title: "Most Popular Category", //
        value: "Electronics", //
        type: "blue", //
        icon: "fas fa-microchip", //
        description: "62% of total orders", //
      }, //
      { //
        title: "Order Completion Rate", //
        value: "92%", //
        type: "emerald", //
        icon: "fas fa-chart-pie", //
        description: "Excellent fulfillment rate", //
      }, //
    ], //
  }; //

  const customersData = { //
    title: "Customer Demographics by Location", //
    metrics: [ //
      { //
        label: "Total Customers", //
        value: "3,241", //
        change: "+15%", //
        positive: true, //
        icon: "fas fa-users", //
        color: "from-purple-500 to-indigo-600", //
      }, //
      { //
        label: "New Customers", //
        value: "428", //
        change: "+12%", //
        positive: true, //
        icon: "fas fa-user-plus", //
        color: "from-green-500 to-emerald-600", //
      }, //
      { //
        label: "Returning Customers", //
        value: "1,876", //
        change: "+8%", //
        positive: true, //
        icon: "fas fa-user-check", //
        color: "from-blue-500 to-cyan-600", //
      }, //
      { //
        label: "Customer Retention", //
        value: "68%", //
        change: "+3%", //
        positive: true, //
        icon: "fas fa-heart", //
        color: "from-pink-500 to-rose-600", //
      }, //
    ], //
    chartData: //
      timePeriod === "month" //
        ? transformToMonthlyData(analyticData, "consumers_count") //
        : transformToWeeklySales(analyticData, "consumers_count"), //
    insights: [ //
      { //
        title: "Highest Traffic Day", //
        value: "Saturday", //
        type: "amber", //
        icon: "fas fa-calendar-week", //
        description: "Peak customer activity", //
      }, //
      { //
        title: "Top Demographic", //
        value: "25-34 years", //
        type: "blue", //
        icon: "fas fa-users", //
        description: "Primary customer segment", //
      }, //
      { //
        title: "Average Customer Lifetime", //
        value: "14 months", //
        type: "emerald", //
        icon: "fas fa-clock", //
        description: "Strong customer loyalty", //
      }, //
    ], //
  }; //

  const productsData = { //
    title: "Top Selling Products", //
    metrics: [ //
      { //
        label: "Total Products", //
        value: "142", //
        change: "+5%", //
        positive: true, //
        icon: "fas fa-boxes", //
        color: "from-indigo-500 to-purple-600", //
      }, //
      { //
        label: "Top Seller", //
        value: "Smartwatch Pro", //
        change: "245 sold", //
        positive: true, //
        icon: "fas fa-crown", //
        color: "from-yellow-500 to-orange-500", //
      }, //
      { //
        label: "Low Stock Items", //
        value: "18", //
        change: "-3", //
        positive: false, //
        icon: "fas fa-exclamation-triangle", //
        color: "from-red-500 to-rose-600", //
      }, //
      { //
        label: "New This Month", //
        value: "12", //
        change: "+4", //
        positive: true, //
        icon: "fas fa-plus-circle", //
        color: "from-green-500 to-emerald-600", //
      }, //
    ], //
    chartData: [ //
      { month: "Jan", value: 80 }, //
      { month: "Feb", value: 90 }, //
      { month: "Mar", value: 100 }, //
      { month: "Apr", value: 120 }, //
      { month: "May", value: 140 }, //
      { month: "Jun", value: 160 }, //
      { month: "Jul", value: 180 }, //
      { month: "Aug", value: 200 }, //
      { month: "Sep", value: 190 }, //
      { month: "Oct", value: 180 }, //
      { month: "Nov", value: 170 }, //
      { month: "Dec", value: 160 }, //
    ], //
    insights: [ //
      { //
        title: "Best Selling Category", //
        value: "Wearables", //
        type: "amber", //
        icon: "fas fa-watch", //
        description: "Leading product category", //
      }, //
      { //
        title: "Highest Rated Product", //
        value: "Wireless Headphones", //
        type: "blue", //
        icon: "fas fa-star", //
        description: "4.9/5 customer rating", //
      }, //
      { //
        title: "Inventory Status", //
        value: "Healthy", //
        type: "emerald", //
        icon: "fas fa-warehouse", //
        description: "Well-stocked inventory", //
      }, //
    ], //
  }; //
  // --- End Data Definitions ---

  const getCurrentData = () => { //
    switch (activeTab) { //
      case "orders": //
        return ordersData; //
      case "customers": //
        return customersData; //
      case "products": //
        return productsData; //
      default: //
        return salesData; //
    } //
  }; //

  const currentData = getCurrentData(); //

  // --- Chart Point Generation --- (MODIFIED FOR RESPONSIVENESS)
  // These functions now use the viewBox dimensions (400x200) directly
  const generateChartPoints = (data) => { //
    if (!data || data.length === 0) return ""; // Handle empty data
    const maxValue = Math.max(...data.map((item) => item.value)); //
    const minValue = Math.min(...data.map((item) => item.value)); //
    const range = maxValue - minValue || 1; //
    // Use viewBox dimensions
    const width = 400; //
    const height = 200; //
    const padding = 20; //

    return data //
      .map((item, index) => { //
        // Calculate X based on index and viewBox width
        const x = padding + (index * (width - 2 * padding)) / Math.max(1, data.length - 1); // Avoid division by zero
        // Calculate Y based on value and viewBox height
        const y = padding + ((maxValue - item.value) / range) * (height - 2 * padding); //
        return `${x.toFixed(2)},${y.toFixed(2)}`; // Use toFixed for potentially smoother curves
      }) //
      .join(" "); //
  }; //

  const generateAreaPoints = (data) => { //
      if (!data || data.length === 0) return ""; // Handle empty data
    const points = generateChartPoints(data); //
     // Use viewBox dimensions
    const width = 400; //
    const height = 200; //
    const padding = 20; //
    // Start at bottom-left, go through points, end at bottom-right
    return `${padding},${height - padding} ${points} ${width - padding},${height - padding}`; //
  }; //
  // --- End Chart Point Generation ---


  const timeRanges = [ //
    { value: "week", label: "This Week" }, //
    { value: "month", label: "This Month" }, //
    { value: "total", label: "Total" }, //
  ]; //

  const tabConfig = { //
    sales: { //
      icon: "fas fa-chart-line", //
      color: "text-green-600", //
      bgColor: "bg-green-50", //
    }, //
    orders: { //
      icon: "fas fa-shopping-cart", //
      color: "text-blue-600", //
      bgColor: "bg-blue-50", //
    }, //
    customers: { //
      icon: "fas fa-users", //
      color: "text-purple-600", //
      bgColor: "bg-purple-50", //
    }, //
    products: { //
      icon: "fas fa-box", //
      color: "text-orange-600", //
      bgColor: "bg-orange-50", //
    }, //
  }; //

  // Filter labels for mobile view
  const getVisibleLabels = (labels) => {
      if (!labels || labels.length === 0) return [];
      const count = labels.length;
      // Show fewer labels on smaller screens
      // You can adjust these numbers based on how it looks
      if (count <= 6) return labels; // Show all if 6 or less
      // Show roughly half for medium screens, maybe quarter for small
      // This example shows every other label
      return labels.filter((_, index) => index % 2 === 0);
  };
  const visibleChartLabels = getVisibleLabels(currentData.chartData);


  return (
    // Removed outer padding p-6, assuming layout provides it
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"> {/* Ensure min height */}
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          {/* Title is handled by Layout, so it's removed here */}
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          {/* Time Range Selector */}
          <select //
            onChange={(e) => setTimePeriod(e.target.value)} //
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-medium" //
          >
            {timeRanges.map((range) => ( //
              <option key={range.value} value={range.value}> {/* */}
                {range.label} {/* */}
              </option> //
            ))} {/* */}
          </select> 

          {/* Export Button */}
          
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden"> {/* */}
        <div className="flex overflow-x-auto"> {/* */}
          {Object.entries(tabConfig).map(([key, config]) => ( //
            <button //
              key={key} //
              onClick={() => setActiveTab(key)} //
              className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 font-semibold transition-all duration-200 min-w-0 flex-shrink-0 border-b-2 ${ // Adjusted padding, gap
                activeTab === key //
                  ? `${config.color} ${config.bgColor} border-current` //
                  : "text-gray-600 hover:text-gray-800 border-transparent hover:bg-gray-50" //
              }`}
            >
              <i className={`${config.icon} text-base sm:text-lg`}></i> {/* Adjusted icon size */}
              <span className="capitalize text-sm sm:text-base">{key}</span> {/* Adjusted text size */}
              {activeTab === key && ( //
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-pulse ml-1"></div> // Adjusted size and margin
              )}
            </button> //
          ))} {/* */}
        </div>
      </div>

      {/* Enhanced Metric Cards */}
      {/* Grid layout adjusts columns based on screen size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8"> {/* Adjusted gap */}
        {currentData.metrics.map((metric, index) => ( //
          <div //
            key={index} //
            className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1" // Adjusted padding
          >
            {/* Gradient Background */}
            <div //
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${metric.color} rounded-t-2xl`} //
            ></div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-3"> {/* Adjusted gap */}
                  <div //
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center shadow-lg`} // Adjusted size
                  >
                    <i className={`${metric.icon} text-white text-base sm:text-lg`}></i> {/* Adjusted size */}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide"> {/* Adjusted size */}
                      {metric.label} {/* */}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-2xl sm:text-3xl font-black text-gray-900"> {/* Adjusted size */}
                    {metric.value} {/* */}
                  </p>
                </div>

                <div //
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold ${ // Adjusted size & gap
                    metric.positive ? "text-green-600" : "text-red-600" //
                  }`}
                >
                  <div //
                    className={`p-1 rounded-full ${ //
                      metric.positive ? "bg-green-100" : "bg-red-100" //
                    }`}
                  >
                    <i //
                      className={`fas fa-arrow-${ //
                        metric.positive ? "up" : "down" //
                      } text-xs`} //
                    ></i>
                  </div>
                  <span className="whitespace-nowrap">{metric.change} vs last month</span> {/* Added whitespace-nowrap */}
                </div>
              </div>
            </div>
          </div> //
        ))} {/* */}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Enhanced Chart Section */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"> {/* Adjusted padding */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"> {/* Added gap */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900"> {/* Adjusted size */}
                {currentData.title} {/* */}
              </h2>
              <p className="text-gray-600 text-sm">
                Performance trends over time
              </p>
            </div>

            <div className="flex items-center gap-2"> {/* */}
              <button //
                onClick={() => setViewMode("chart")} //
                className={`p-2 rounded-lg transition-all ${ //
                  viewMode === "chart" //
                    ? "bg-orange-100 text-orange-600" //
                    : "text-gray-500 hover:bg-gray-100" //
                }`}
              >
                <i className="fas fa-chart-line"></i> {/* */}
              </button> 
              <button //
                onClick={() => setViewMode("bar")} //
                className={`p-2 rounded-lg transition-all ${ //
                  viewMode === "bar" //
                    ? "bg-orange-100 text-orange-600" //
                    : "text-gray-500 hover:bg-gray-100" //
                }`}
              >
                <i className="fas fa-chart-bar"></i> {/* */}
              </button> 
            </div>
          </div>

          {/* Responsive SVG Container */}
          <div className="relative h-64 sm:h-80 w-full bg-gradient-to-t from-gray-50 to-transparent rounded-xl p-2 sm:p-4"> {/* Adjusted height and padding */}
            {currentData.chartData && currentData.chartData.length > 0 ? ( // Check if data exists
                 <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet"> {/* Added preserveAspectRatio */}
                 {/* Enhanced Grid */}
                 <defs> {/* */}
                    <pattern //
                      id="grid" //
                      width="40" //
                      height="20" //
                      patternUnits="userSpaceOnUse" //
                    >
                      <path //
                        d="M 40 0 L 0 0 0 20" //
                        fill="none" //
                        stroke="#e5e7eb" //
                        strokeWidth="0.5" //
                      />
                    </pattern> //
                    <linearGradient //
                      id="areaGradient" //
                      x1="0%" //
                      y1="0%" //
                      x2="0%" //
                      y2="100%" //
                    >
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" /> {/* */}
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" /> {/* */}
                    </linearGradient> //
                  </defs> {/* */}

                  <rect width="100%" height="100%" fill="url(#grid)" /> {/* */}

                  {/* Area under the line */}
                  <polygon //
                    fill="url(#areaGradient)" //
                    points={generateAreaPoints(currentData.chartData)} //
                  />

                  {/* Enhanced line chart */}
                  <polyline //
                    fill="none" //
                    stroke="#f97316" //
                    strokeWidth="2" // Adjusted stroke width
                    strokeLinecap="round" //
                    strokeLinejoin="round" //
                    points={generateChartPoints(currentData.chartData)} //
                    className="transition-all duration-500 filter drop-shadow-sm" //
                  />

                  {/* Enhanced data points - smaller radius */}
                  {currentData.chartData.map((point, index) => { //
                    const maxValue = Math.max( //
                      ...currentData.chartData.map((item) => item.value) //
                    ); //
                    const minValue = Math.min( //
                      ...currentData.chartData.map((item) => item.value) //
                    ); //
                    const range = maxValue - minValue || 1; //
                    const width = 400; //
                    const height = 200; //
                    const padding = 20; //
                    const x = //
                      padding + //
                      (index * (width - 2 * padding)) / //
                        Math.max(1, currentData.chartData.length - 1); // Avoid division by zero
                    const y = //
                      padding + //
                      ((maxValue - point.value) / range) * (height - 2 * padding); //

                    return ( //
                      <g key={index}> {/* */}
                        {/* Smaller circles */}
                        <circle //
                          cx={x} //
                          cy={y} //
                          r="4" // Reduced radius
                          fill="white" //
                          stroke="#f97316" //
                          strokeWidth="2" // Reduced stroke
                          className="transition-all duration-300 hover:r-6 cursor-pointer filter drop-shadow-sm" // Hover radius adjusted
                        />
                        <circle cx={x} cy={y} r="1.5" fill="#f97316" /> {/* Reduced inner circle */}
                      </g> //
                    ); //
                  })} {/* */}
                </svg>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    No chart data available for this period.
                </div>
            )}
          </div>

          {/* Responsive X-axis labels */}
           {currentData.chartData && currentData.chartData.length > 0 && (
                <div className="grid grid-cols-6 lg:grid-cols-12 gap-1 sm:gap-2 mt-4 text-[10px] sm:text-xs font-medium text-gray-500"> {/* Start with fewer columns */}
                    {timePeriod === 'month' && currentData.chartData.map((point, index) => ( // Show all 12 for month view if possible
                        <div key={index} className={`text-center ${index % 2 !== 0 ? 'hidden sm:block lg:block' : ''}`}> {/* Hide some labels on small screens */}
                            {point.month}
                        </div>
                    ))}
                     {timePeriod !== 'month' && currentData.chartData.map((point, index) => ( // Handle weekly labels differently if needed
                        <div key={index} className="text-center">
                            W{index + 1} {/* Example: W1, W2... */}
                        </div>
                     ))}
                </div>
           )}
        </div>

        {/* Enhanced Insights Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"> {/* Adjusted padding */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6"> {/* Adjusted gap */}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center"> {/* */}
              <i className="fas fa-lightbulb text-white text-sm"></i> {/* */}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Quick Insights</h2> {/* Adjusted size */}
          </div>

          <div className="space-y-3 sm:space-y-4 mb-8"> {/* Adjusted spacing */}
            {currentData.insights.map((insight, index) => ( //
              <div //
                key={index} //
                className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${ // Adjusted padding
                  insight.type === "amber" 
                    ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-300" //
                    : insight.type === "blue" //
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300" 
                    : "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-300" 
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3"> {/* Adjusted gap */}
                  <div 
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${ // Adjusted size
                      insight.type === "amber" 
                        ? "bg-amber-500 text-white" 
                        : insight.type === "blue" 
                        ? "bg-blue-500 text-white" 
                        : "bg-emerald-500 text-white" 
                    }`}
                  >
                    <i className={`${insight.icon} text-xs sm:text-sm`}></i> {/* Adjusted size */}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base"> {/* Adjusted size */}
                      {insight.title} {/* */}
                    </h3>
                    <p className="text-gray-800 font-medium mb-1 text-sm sm:text-base"> {/* Adjusted size */}
                      {insight.value} {/* */}
                    </p>
                    <p className="text-xs sm:text-xs text-gray-600"> {/* Adjusted size */}
                      {insight.description} {/* */}
                    </p>
                  </div>
                </div>

                {insight.trend && ( //
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-pulse"></div> {/* Adjusted size */}
                  </div>
                )}
              </div> //
            ))} {/* */}
          </div>

          {/* Enhanced Action Buttons */}
         
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;
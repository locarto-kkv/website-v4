import React, { useState } from 'react';

const VendorAnalytics = () => {
  const [activeTab, setActiveTab] = useState('sales');

  // Mock data for different tabs
  const salesData = {
    title: "Sales Performance",
    metrics: [
      { label: "Total Revenue", value: "$405,091.00", change: "+12%", positive: true },
      { label: "Avg. Order Value", value: "$271.50", change: "-3.2%", positive: false },
      { label: "Total Orders", value: "1,492", change: "+8%", positive: true },
      { label: "Conversion Rate", value: "2.5%", change: "+0.5%", positive: true }
    ],
    chartData: [
      { month: "Jan", value: 180 },
      { month: "Feb", value: 160 },
      { month: "Mar", value: 130 },
      { month: "Apr", value: 100 },
      { month: "May", value: 140 },
      { month: "Jun", value: 120 },
      { month: "Jul", value: 110 },
      { month: "Aug", value: 100 },
      { month: "Sep", value: 90 },
      { month: "Oct", value: 80 },
      { month: "Nov", value: 70 },
      { month: "Dec", value: 60 }
    ],
    insights: [
      { title: "Best Day for Sales", value: "Wednesday", type: "amber" },
      { title: "Top Performing Product", value: "Smartwatch Pro", type: "blue" },
      { title: "Customer Growth Trend", value: "Positive", type: "emerald", trend: true }
    ]
  };

  const ordersData = {
    title: "Order Analytics",
    metrics: [
      { label: "Total Orders", value: "1,492", change: "+8%", positive: true },
      { label: "Pending Orders", value: "42", change: "-5%", positive: true },
      { label: "Completed Orders", value: "1,380", change: "+12%", positive: true },
      { label: "Cancelled Orders", value: "70", change: "-3%", positive: true }
    ],
    chartData: [
      { month: "Jan", value: 90 },
      { month: "Feb", value: 110 },
      { month: "Mar", value: 130 },
      { month: "Apr", value: 100 },
      { month: "May", value: 120 },
      { month: "Jun", value: 140 },
      { month: "Jul", value: 150 },
      { month: "Aug", value: 160 },
      { month: "Sep", value: 140 },
      { month: "Oct", value: 130 },
      { month: "Nov", value: 120 },
      { month: "Dec", value: 110 }
    ],
    insights: [
      { title: "Peak Order Day", value: "Friday", type: "amber" },
      { title: "Most Popular Category", value: "Electronics", type: "blue" },
      { title: "Order Completion Rate", value: "92%", type: "emerald" }
    ]
  };

  const customersData = {
    title: "Customer Insights",
    metrics: [
      { label: "Total Customers", value: "3,241", change: "+15%", positive: true },
      { label: "New Customers", value: "428", change: "+12%", positive: true },
      { label: "Returning Customers", value: "1,876", change: "+8%", positive: true },
      { label: "Customer Retention", value: "68%", change: "+3%", positive: true }
    ],
    chartData: [
      { month: "Jan", value: 120 },
      { month: "Feb", value: 140 },
      { month: "Mar", value: 160 },
      { month: "Apr", value: 180 },
      { month: "May", value: 200 },
      { month: "Jun", value: 220 },
      { month: "Jul", value: 240 },
      { month: "Aug", value: 260 },
      { month: "Sep", value: 280 },
      { month: "Oct", value: 300 },
      { month: "Nov", value: 320 },
      { month: "Dec", value: 340 }
    ],
    insights: [
      { title: "Highest Traffic Day", value: "Saturday", type: "amber" },
      { title: "Top Demographic", value: "25-34 years", type: "blue" },
      { title: "Average Customer Lifetime", value: "14 months", type: "emerald" }
    ]
  };

  const productsData = {
    title: "Product Performance",
    metrics: [
      { label: "Total Products", value: "142", change: "+5%", positive: true },
      { label: "Top Seller", value: "Smartwatch Pro", change: "245 sold", positive: true },
      { label: "Low Stock Items", value: "18", change: "-3", positive: false },
      { label: "New This Month", value: "12", change: "+4", positive: true }
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
      { month: "Dec", value: 160 }
    ],
    insights: [
      { title: "Best Selling Category", value: "Wearables", type: "amber" },
      { title: "Highest Rated Product", value: "Wireless Headphones", type: "blue" },
      { title: "Inventory Status", value: "Healthy", type: "emerald" }
    ]
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    switch(activeTab) {
      case 'orders': return ordersData;
      case 'customers': return customersData;
      case 'products': return productsData;
      default: return salesData;
    }
  };

  const currentData = getCurrentData();

  // Generate chart points
  const generateChartPoints = (data) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));
    const range = maxValue - minValue || 1;
    
    return data.map((item, index) => {
      const x = (index * 360) / (data.length - 1);
      const y = 180 - ((item.value - minValue) / range) * 160;
      return `${x},${y}`;
    }).join(' ');
  };

  // Generate area points
  const generateAreaPoints = (data) => {
    const points = generateChartPoints(data);
    return `${points} 360,180 0,180`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Vendor Analytics</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('sales')}
          className={`px-4 py-2 font-medium ${activeTab === 'sales' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'}`}
        >
          Sales
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'}`}
        >
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 font-medium ${activeTab === 'customers' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'}`}
        >
          Customers
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'}`}
        >
          Products
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Metric Cards */}
        {currentData.metrics.map((metric, index) => (
          <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-600">{metric.label}</p>
            <p className="text-2xl font-bold mt-1">{metric.value}</p>
            <div className={`flex items-center mt-2 text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                {metric.positive ? (
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V7.414a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                )}
              </svg>
              <span>{metric.change} vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">{currentData.title}</h2>
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Grid lines */}
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={(i + 1) * 20}
                  x2="400"
                  y2={(i + 1) * 20}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1={i * 33.3}
                  y1="0"
                  x2={i * 33.3}
                  y2="200"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              {/* Area under the line */}
              <polygon
                fill="#fff0e6"
                opacity="0.6"
                points={generateAreaPoints(currentData.chartData)}
              />

              {/* Line chart path */}
              <polyline
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                points={generateChartPoints(currentData.chartData)}
                className="transition-all duration-300"
              />

              {/* Data points */}
              {currentData.chartData.map((point, index) => {
                const maxValue = Math.max(...currentData.chartData.map(item => item.value));
                const minValue = Math.min(...currentData.chartData.map(item => item.value));
                const range = maxValue - minValue || 1;
                const x = (index * 360) / (currentData.chartData.length - 1);
                const y = 180 - ((point.value - minValue) / range) * 160;
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#f97316"
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            {currentData.chartData.map((point, index) => (
              <span key={index}>{point.month}</span>
            ))}
          </div>
        </div>

        {/* Quick Insights Sidebar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>
          
          <div className="space-y-4">
            {currentData.insights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  insight.type === 'amber' ? 'bg-amber-50 border-amber-200' :
                  insight.type === 'blue' ? 'bg-blue-50 border-blue-200' :
                  'bg-emerald-50 border-emerald-200'
                }`}
              >
                <h3 className="font-medium text-gray-800">{insight.title}</h3>
                <p className="text-gray-600">{insight.value}</p>
                {insight.trend && (
                  <div className="flex items-center mt-1">
                    <svg className="w-4 h-4 mr-1 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-600">Positive</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;
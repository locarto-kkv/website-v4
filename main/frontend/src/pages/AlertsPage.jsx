// src/pages/AlertsPage.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'; // Assuming Navbar is in components
import Footer from '../components/Footer'; // Assuming Footer is in components
import { Link } from 'react-router-dom';

const AlertsPage = () => {
  // --- Mock Data (Replace with actual data fetching later) ---
  const [alerts, setAlerts] = useState([
    // { id: 1, type: 'order_shipped', title: 'Order Shipped!', message: 'Your order #ORD12345 has been shipped.', date: '2025-10-26T10:30:00Z', read: false, link: '/consumer/dashboard/orders' },
    // { id: 2, type: 'new_product', title: 'New Arrival', message: 'Check out the latest product from Vendor XYZ.', date: '2025-10-25T15:00:00Z', read: true, link: '/map' },
    // { id: 3, type: 'review_reply', title: 'Reply to your review', message: 'Vendor ABC replied to your review on "Stylish Watch".', date: '2025-10-24T09:15:00Z', read: true, link: '/consumer/dashboard/reviews' },
  ]);
  const [loading, setLoading] = useState(false); // Add loading state if fetching data

  useEffect(() => {
    window.scrollTo(0, 0);
    // Add data fetching logic here if needed
  }, []);

  // --- Helper to get icon/color based on alert type (Example) ---
  const getAlertStyle = (type) => {
    switch (type) {
      case 'order_shipped':
        return { icon: 'fas fa-truck', color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'new_product':
        return { icon: 'fas fa-box-open', color: 'text-green-500', bg: 'bg-green-50' };
      case 'review_reply':
        return { icon: 'fas fa-comment', color: 'text-purple-500', bg: 'bg-purple-50' };
      default:
        return { icon: 'fas fa-bell', color: 'text-gray-500', bg: 'bg-gray-50' };
    }
  };

  // --- Function to format date (relative or absolute) ---
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Basic formatting, replace with a library like date-fns for relative time
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const markAsRead = (id) => {
    setAlerts(alerts.map(alert => alert.id === id ? { ...alert, read: true } : alert));
    // Add API call here later to update backend
  };

  const markAllRead = () => {
     setAlerts(alerts.map(alert => ({ ...alert, read: true })));
      // Add API call here later to update backend
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content Area */}
      {/* Added pt-20 for fixed top nav, adjust if needed */}
      <main className="flex-grow container mx-auto px-4 py-8 pt-20 sm:pt-24 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <i className="fas fa-inbox text-white text-xl"></i>
              </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Notifications Inbox
            </h1>
          </div>
          {alerts.length > 0 && alerts.some(a => !a.read) && (
              <button
                onClick={markAllRead}
                className="text-xs sm:text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-1.5"
              >
                 <i className="fas fa-check-double"></i> Mark all as read
              </button>
          )}
        </div>

        {/* Alerts List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
             <div className="text-center p-12 text-gray-500">Loading...</div>
          ) : alerts.length === 0 ? (
            // Empty State
            <div className="text-center p-12 sm:p-16">
               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <i className="fas fa-bell-slash text-3xl text-gray-400"></i>
               </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Notifications Yet</h3>
              <p className="text-gray-500 text-sm">Your alerts and updates will appear here.</p>
            </div>
          ) : (
             // List of Alerts
             <ul className="divide-y divide-gray-100">
              {alerts.map((alert) => {
                 const style = getAlertStyle(alert.type);
                 return (
                  <li
                    key={alert.id}
                    className={`p-4 sm:p-6 transition-colors duration-200 hover:bg-gray-50 ${alert.read ? 'opacity-70' : 'bg-orange-50/50'}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                       <div className={`w-10 h-10 sm:w-12 sm:h-12 ${style.bg} rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200`}>
                         <i className={`${style.icon} ${style.color} text-base sm:text-lg`}></i>
                       </div>
                       {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-1">
                           <h4 className={`font-bold text-sm sm:text-base text-gray-900 ${!alert.read ? 'text-orange-700' : ''}`}>
                             {alert.title || 'Notification'}
                           </h4>
                           <span className="text-xs text-gray-500 whitespace-nowrap">
                             {formatDate(alert.date)}
                           </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{alert.message}</p>
                        {/* Actions */}
                        <div className="flex items-center gap-4 text-xs">
                          {alert.link && (
                              <Link to={alert.link} className="font-medium text-orange-600 hover:text-orange-800 hover:underline">
                                View Details <i className="fas fa-arrow-right ml-1 text-[10px]"></i>
                              </Link>
                          )}
                          {!alert.read && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              className="font-medium text-gray-500 hover:text-gray-700"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                       {/* Unread Dot */}
                       {!alert.read && (
                         <div className="w-2.5 h-2.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" title="Unread"></div>
                       )}
                    </div>
                  </li>
                 );
              })}
             </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AlertsPage;
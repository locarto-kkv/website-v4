import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import LoginCustomer from './pages/LoginCustomer';
import LoginVendor from './pages/LoginVendor';
import VendorPending from './pages/VendorPending';
import VendorDashboard from './pages/VendorDashboard';
import CustomerDashboard from './pages/CustomerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login/customer" element={<LoginCustomer />} />
            <Route path="/login/vendor" element={<LoginVendor />} />
            <Route path="/vendor/pending-approval" element={<VendorPending />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
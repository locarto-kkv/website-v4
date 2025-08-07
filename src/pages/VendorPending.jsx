import React from 'react';
import { Link } from 'react-router-dom';

const VendorPending = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100">
            <i className="fas fa-clock text-primary text-3xl"></i>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Pending Approval</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your vendor account is under review. You'll receive an email notification once approved.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPending;
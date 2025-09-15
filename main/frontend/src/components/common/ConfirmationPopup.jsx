import React from 'react';

const ConfirmationPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <i className="fas fa-check text-green-600 text-xl"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mt-4">Submitted for Review</h3>
        <p className="text-gray-600 mt-2">
          Thanks! Sit tight while we verify your details. You'll be notified once accepted.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
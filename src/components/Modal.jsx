import React from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        {title && <h2 className="text-2xl font-bold text-center mb-6 text-secondary">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
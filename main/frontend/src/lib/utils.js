export const DateTimeDisplay = ({ dateString }) => {
  const date = new Date(dateString);

  const formatted = date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formatted;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount ?? 0);
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getOrderStatusConfig = (status) => {
  const configs = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: "fas fa-clock",
      label: "Pending",
    },
    processing: {
      color: "bg-blue-100 text-blue-800",
      icon: "fas fa-cog",
      label: "Processing",
    },
    shipped: {
      color: "bg-purple-100 text-purple-800",
      icon: "fas fa-shipping-fast",
      label: "Shipped",
    },
    delivered: {
      color: "bg-green-100 text-green-800",
      icon: "fas fa-check-circle",
      label: "Delivered",
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: "fas fa-times-circle",
      label: "Cancelled",
    },
    refunded: {
      color: "bg-gray-100 text-gray-800",
      icon: "fas fa-undo",
      label: "Refunded",
    },
  };
  return configs[status?.toLowerCase()] || configs.pending;
};

export const getProductIcon = (category) => {
  const icons = {
    Electronics: "fas fa-laptop",
    Wearables: "fas fa-clock",
    Audio: "fas fa-volume-up",
    Accessories: "fas fa-plug",
    Default: "fas fa-box",
  };
  return icons[category] || icons["Default"];
};

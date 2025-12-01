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

export const getGreeting = (name) => {
  const now = new Date();
  const hours = now.getHours();

  const lower = name.toLowerCase();
  const formattedName = lower.charAt(0).toUpperCase() + lower.slice(1);

  if (hours >= 5 && hours < 12) {
    return `Good Morning ${formattedName}!`;
  } else if (hours >= 12 && hours < 17) {
    return `Good Afternoon ${formattedName}!`;
  } else if (hours >= 17 && hours < 21) {
    return `Good Evening ${formattedName}!`;
  } else {
    return `How was your day ${formattedName} ?`;
  }
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
    confirmed: {
      color: "bg-indigo-100 text-indigo-800",
      icon: "fas fa-check",
      label: "Confirmed",
    },
    "ready-for-pickup": {
      color: "bg-orange-100 text-orange-800",
      icon: "fas fa-box-open",
      label: "Ready for Pickup",
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
    refunding: {
      color: "bg-pink-100 text-pink-800",
      icon: "fas fa-sync-alt",
      label: "Refunding",
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
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

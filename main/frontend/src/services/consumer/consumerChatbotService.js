export const rules = {
  ORDERS: {
    "I have an issue with the ordered item(s)": {
      CLOSED: {
        "Yes, I want to share feedback": { FEEDBACK: "END" },
        "No, I don't want to share feedback": {
          "Thank you for confirmation": "END",
        },
      },
      ELSE: {},
    },
    "I want to report delivery partner misconduct": { COMPLAINT: "END" },
    "I have not recieved my order": {
      CLOSED: { "Okay, got it": "END" },
      ELSE: {},
    },
    "I have another issue with my order": {
      "I want to report a price discrepency": {
        CLOSED: {
          "Yes, I want to share feedback": { FEEDBACK: "END" },
          "No, I don't want to share feedback": {
            "Thank you for confirmation": "END",
          },
        },
        ELSE: {},
      },
      "I want a copy of my order invoice": { EMAIL: "END" },
    },
  },
  "Show previous orders": "ORDERS",
  "My issue is not listed here": {
    "Issue placing an order": {
      "My store is temorarily unavailable": { "Okay, got it": "END" },
      "Product not available": { COMPLAINT: "END" },
      "Area out of service": { "Okay, got it": "END" },
    },
  },
};

export function getNextOptions(path) {
  let current = rules;

  for (let key of path) {
    if (typeof current === "string") {
      current = rules[current];
    } else if (typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }

  if (typeof current === "string") {
    if (current === "END") return "END";
    current = rules[current];
  }

  if (typeof current === "object") {
    const keys = Object.keys(current);
    if (keys.length === 0) return "END";
    return keys;
  }

  return "END";
}

export const rules = {
  ORDERS: {
    // Choose order number
    "I have an issue with the ordered item(s)": {
      CLOSED: {
        // order support_status === "closed"
        "Yes, I want to share feedback": {
          FEEDBACK: "END", // take feedback and Exit
        },
        "No, I don't want to share feedback": {
          "Thank you for confirmation": "END", // Exit
        },
      },
      COMPLAINT: "END", // write a complaint and Exit
    },
    "I want to report delivery partner misconduct": {
      COMPLAINT: "END", // write a complaint and Exit
    },
    "I have not recieved my order": {
      CLOSED: {
        // order support_status === "closed"
        "Okay, got it": "END", // Exit
      },
      COMPLAINT: "END", // write a complaint and Exit
    },
    "I have another issue with my order": {
      "I want to report a price discrepency": {
        CLOSED: {
          // order support_status === "closed"
          "Yes, I want to share feedback": {
            FEEDBACK: "END", // take feedback and Exit
          },
          "No, I don't want to share feedback": {
            "Thank you for confirmation": "END", // Exit
          },
        },
        COMPLAINT: "END", // write a complaint and Exit
      },
      "I want a copy of my order invoice": {
        EMAIL: "END", // take email and Exit
      },
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

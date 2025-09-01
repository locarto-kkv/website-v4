import axios from "axios";

export const consumers = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
    address: "123 Main St, New York, USA",
    phone_no: "1234567890",
    age: "28",
    sex: "Female",
    country: "USA",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    password: "password123",
    address: "456 Market Rd, London, UK",
    phone_no: "447123456789",
    age: "35",
    sex: "Male",
    country: "UK",
  },
  {
    name: "Carlos Ramirez",
    email: "carlos@example.com",
    password: "password123",
    address: "789 Avenida, Mexico City, MX",
    phone_no: "5215512345678",
    age: "42",
    sex: "Male",
    country: "Mexico",
  },
  {
    name: "Diana Chen",
    email: "diana@example.com",
    password: "password123",
    address: "101 Lotus St, Beijing, China",
    phone_no: "8613812345678",
    age: "30",
    sex: "Female",
    country: "China",
  },
  {
    name: "Ethan Brown",
    email: "ethan@example.com",
    password: "password123",
    address: "202 Ocean Dr, Sydney, Australia",
    phone_no: "61412345678",
    age: "26",
    sex: "Male",
    country: "Australia",
  },
];

async function seedConsumers() {
  for (let consumer of consumers) {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/consumer/auth/signup",
        consumer
      );
      console.log(`✅ Added: ${consumer.name}`, res.data);
    } catch (err) {
      console.error(
        `❌ Error adding ${consumer.name}:`,
        err.response?.data || err.message
      );
    }
  }
}

// seedConsumers();

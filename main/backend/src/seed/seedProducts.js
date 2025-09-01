import axios from "axios";
import { vendors } from "./seedVendors.js";

export const products = [
  {
    name: "Wireless Mouse",
    category: "Electronics",
    price: 25.99,
    quantity: 100,
    vendor_id: 342,
    product_images: ["https://example.com/images/mouse.jpg"],
    reviews: 10,
  },
  {
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 79.99,
    quantity: 50,
    vendor_id: 342,
    product_images: ["https://example.com/images/keyboard.jpg"],
    reviews: 8,
  },
  {
    name: "Running Shoes",
    category: "Sportswear",
    price: 59.99,
    quantity: 200,
    vendor_id: 343,
    product_images: ["https://example.com/images/shoes.jpg"],
    reviews: 15,
  },
  {
    name: "Yoga Mat",
    category: "Sportswear",
    price: 19.99,
    quantity: 150,
    vendor_id: 343,
    product_images: ["https://example.com/images/yogamat.jpg"],
    reviews: 12,
  },
  {
    name: "Organic Honey",
    category: "Groceries",
    price: 12.49,
    quantity: 300,
    vendor_id: 34,
    product_images: ["https://example.com/images/honey.jpg"],
    reviews: 20,
  },
  {
    name: "Almond Milk",
    category: "Groceries",
    price: 4.99,
    quantity: 500,
    vendor_id: 34,
    product_images: ["https://example.com/images/almondmilk.jpg"],
    reviews: 25,
  },
  {
    name: "Smartphone",
    category: "Electronics",
    price: 699.99,
    quantity: 30,
    vendor_id: 35,
    product_images: ["https://example.com/images/smartphone.jpg"],
    reviews: 18,
  },
  {
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 49.99,
    quantity: 75,
    vendor_id: 35,
    product_images: ["https://example.com/images/speaker.jpg"],
    reviews: 22,
  },
  {
    name: "Office Chair",
    category: "Furniture",
    price: 129.99,
    quantity: 40,
    vendor_id: 36,
    product_images: ["https://example.com/images/chair.jpg"],
    reviews: 9,
  },
  {
    name: "Wooden Desk",
    category: "Furniture",
    price: 249.99,
    quantity: 25,
    vendor_id: 36,
    product_images: ["https://example.com/images/desk.jpg"],
    reviews: 11,
  },
  {
    name: "Gaming Laptop",
    category: "Electronics",
    price: 1199.99,
    quantity: 20,
    vendor_id: 342,
    product_images: ["https://example.com/images/gaminglaptop.jpg"],
    reviews: 14,
  },
  {
    name: "Electric Kettle",
    category: "Home Appliances",
    price: 34.99,
    quantity: 60,
    vendor_id: 343,
    product_images: ["https://example.com/images/kettle.jpg"],
    reviews: 7,
  },
  {
    name: "Leather Wallet",
    category: "Accessories",
    price: 45.0,
    quantity: 80,
    vendor_id: 34,
    product_images: ["https://example.com/images/wallet.jpg"],
    reviews: 16,
  },
  {
    name: 'LED Monitor 27"',
    category: "Electronics",
    price: 229.99,
    quantity: 35,
    vendor_id: 35,
    product_images: ["https://example.com/images/monitor.jpg"],
    reviews: 19,
  },
  {
    name: "Coffee Maker",
    category: "Home Appliances",
    price: 89.99,
    quantity: 45,
    vendor_id: 36,
    product_images: ["https://example.com/images/coffeemaker.jpg"],
    reviews: 13,
  },
];

export async function login_user(userData, type) {
  try {
    const res = await axios.post(
      `http://localhost:5000/api/${type}/auth/login`,
      userData
    );
    console.log(`✅ Logged In: ${userData.name}`);
    return res.headers["set-cookie"];
  } catch (err) {
    console.error(
      `❌ Error Logging In ${userData.name}:`,
      err.response?.data || err.message
    );
  }
}

async function seedProducts() {
  for (let vendor of vendors) {
    const authCookie = await login_user(vendor, "vendor");
    const startIndex = vendors.indexOf(vendor) * 3;
    const vendorProducts = products.slice(startIndex, startIndex + 3);

    for (let product of vendorProducts) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/vendor/product/add",
          product,
          {
            headers: {
              Cookie: authCookie,
            },
          }
        );
        console.log(`✅ Added product: ${product.name}`, res.data);
      } catch (err) {
        console.error(
          `❌ Error adding ${product.name}:`,
          err.response?.data || err.message
        );
      }
    }
  }
}

// seedProducts();

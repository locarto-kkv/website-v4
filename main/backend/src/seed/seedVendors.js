import axios from "axios";

export const vendors = [
  {
    name: "Tech Supplies Inc.",
    email: "techsupplies@example.com",
    password: "password123",
    phone_no: "15551234567",
    address: "123 Silicon Valley, CA, USA",
    documents: {
      license: "LIC-TS-2023",
      taxId: "TAX-TS-5678",
    },
  },
  {
    name: "Green Farms",
    email: "greenfarms@example.com",
    password: "password123",
    phone_no: "447700900123",
    address: "45 Countryside Rd, London, UK",
    documents: {
      license: "LIC-GF-2023",
      taxId: "TAX-GF-3421",
    },
  },
  {
    name: "Global Traders",
    email: "globaltraders@example.com",
    password: "password123",
    phone_no: "5215511122233",
    address: "67 Business Ave, Mexico City, MX",
    documents: {
      license: "LIC-GT-2023",
      taxId: "TAX-GT-8742",
    },
  },
  {
    name: "Fresh Foods Market",
    email: "freshfoods@example.com",
    password: "password123",
    phone_no: "8613712345678",
    address: "89 Lotus Lane, Shanghai, China",
    documents: {
      license: "LIC-FFM-2023",
      taxId: "TAX-FFM-1299",
    },
  },
  {
    name: "Aussie Builders",
    email: "aussiebuilders@example.com",
    password: "password123",
    phone_no: "61498765432",
    address: "200 Harbour St, Sydney, Australia",
    documents: {
      license: "LIC-AB-2023",
      taxId: "TAX-AB-9988",
    },
  },
];

async function seedVendors() {
  for (let vendor of vendors) {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/vendor/auth/signup",
        vendor
      );
      console.log(`✅ Added vendor: ${vendor.name}`, res.data);
    } catch (err) {
      console.error(
        `❌ Error adding ${vendor.name}:`,
        err.response?.data || err.message
      );
    }
  }
}

// seedVendors();

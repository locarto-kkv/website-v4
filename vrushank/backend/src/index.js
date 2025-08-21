import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import path from "path";

import vendorRoutes from "./routes/vendor/index.js";

dotenv.config();

const { PORT: port, FRONTEND_URL: frontendURL } = process.env;

const app = express();
const data = { message: "Hello World" };
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: frontendURL, credentials: true }));

app.use("/api/vendor", vendorRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", async (req, res) => {
  res.json(data);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log("NODE ENV: " + process.env.NODE_ENV);
});

// npm run dev

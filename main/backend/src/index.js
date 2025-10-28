import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import path from "path";
import { env } from "./lib/env.js";

import vendorRoutes from "./routes/vendor/index.js";
import consumerRoutes from "./routes/consumer/index.js";
import adminRoutes from "./routes/admin/index.js";

import { checkAuth, protectRoute } from "./middleware/auth.middleware.js";

const { PORT: port, FRONTEND_URL: frontendURL } = env;

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: frontendURL, credentials: true }));
app.use(compression());

app.use("/api/vendor", vendorRoutes);
app.use("/api/consumer", consumerRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/auth/check", protectRoute(null), checkAuth);

if (process.env.BACKEND_NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log("NODE ENV: " + process.env.BACKEND_NODE_ENV);
});

// npm run dev

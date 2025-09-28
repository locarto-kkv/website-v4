import { getVendorData } from "../../services/vendor/analytic.service.js";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const analytics = await getVendorData(userId);

    res.status(200).json(analytics);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getAnalytics",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

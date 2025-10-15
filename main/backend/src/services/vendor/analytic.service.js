import db from "../../lib/db.js";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getVendorData = async (userId) => {
  try {
    const { data: vendorTotalData } = await db
      .from("total_vendor_summary")
      .select()
      .eq("vendor_id", userId)
      .single();

    const { data: productTotalData } = await db
      .from("total_product_summary")
      .select()
      .eq("vendor_id", userId);

    const { data: vendorMonthlyData } = await db
      .from("monthly_vendor_summary")
      .select()
      .eq("vendor_id", userId);

    const { data: productMonthlyData } = await db
      .from("monthly_product_summary")
      .select()
      .eq("vendor_id", userId);

    const { data: vendorWeeklyData } = await db
      .from("weekly_vendor_summary")
      .select()
      .eq("vendor_id", userId);

    const { data: productWeeklyData } = await db
      .from("weekly_product_summary")
      .select()
      .eq("vendor_id", userId);

    return {
      vendor: {
        total: vendorTotalData,
        monthly: vendorMonthlyData,
        weekly: vendorWeeklyData,
      },
      products: {
        total: productTotalData,
        monthly: productMonthlyData,
        weekly: productWeeklyData,
      },
    };
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getVendorData",
    });
  }
};

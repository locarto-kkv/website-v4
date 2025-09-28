import logger from "../../lib/logger.js";
import db from "../../lib/db.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getImgUploadUrl = async (productId, files) => {
  try {
    const imgUploadUrls = [];

    for (const file of files) {
      const fileType = file.type;
      const fileName = file.name;
      const fileSize = file.size;

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const formattedFileName = `${productId}_${timestamp}_${fileName}`;

      const filePath = `${productId}/${formattedFileName}`;

      const { data, error } = await db.storage
        .from("product-images")
        .createSignedUploadUrl(filePath);

      if (error) throw error;

      imgUploadUrls.push({
        uploadUrl: data.signedUrl,
        filePath,
        fileType,
        fileSize,
      });
    }

    return imgUploadUrls;
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getImgUploadUrl",
    });
  }
};

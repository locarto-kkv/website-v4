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

export const getDocUploadUrl = async (userId, files) => {
  try {
    const docUploadUrls = [];

    for (const file of files) {
      const fileType = file.type;
      const fileName = file.name;
      const fileSize = file.size;

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const formattedFileName = `${userId}_${timestamp}_${fileName}`;

      const filePath = `${userId}/${formattedFileName}`;

      const { data, error } = await db.storage
        .from("vendor-documents")
        .createSignedUploadUrl(filePath);

      if (error) throw error;

      docUploadUrls.push({
        uploadUrl: data.signedUrl,
        filePath,
        fileType,
        fileSize,
      });
    }

    return docUploadUrls;
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getDocUploadUrl",
    });
  }
};

export const deleteFolder = async (bucket, id) => {
  const { data: files } = await db.storage
    .from(bucket)
    .list(id, { limit: 100 });

  const filePaths = files.map((file) => `${id}/${file.name}`);

  await db.storage.from(bucket).remove(filePaths);
};

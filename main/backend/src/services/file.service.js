import logger from "../lib/logger.js";
import db from "../lib/db.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getFileUploadUrl = async (id, file, bucket) => {
  try {
    const imgUploadUrls = [];

    const fileType = file.type;
    const fileName = file.name;
    const fileSize = file.size;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const formattedFileName = `${id}_${timestamp}_${fileName}`;

    const filePath = `${id}/${formattedFileName}`;

    const { data, error } = await db.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (error) throw error;

    imgUploadUrls.push({
      uploadUrl: data.signedUrl,
      filePath,
      fileType,
      fileSize,
    });

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

export const deleteFolder = async (id, bucket) => {
  const { data: files } = await db.storage
    .from(bucket)
    .list(id, { limit: 100 });

  const filePaths = files.map((file) => `${id}/${file.name}`);

  await db.storage.from(bucket).remove(filePaths);
};

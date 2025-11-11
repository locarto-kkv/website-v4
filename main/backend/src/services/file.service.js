import logger from "../lib/logger.js";
import db from "../lib/db.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getFileUploadUrl = async (id, name, file, bucket) => {
  try {
    const fileType = file.type;
    const fileSize = file.size;

    const formattedFileName = `${id}_${name}`;

    const filePath = `${id}/${formattedFileName}`;

    const { data, error } = await db.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (error) throw error;

    return {
      uploadUrl: data.signedUrl,
      filePath,
      fileType,
      fileSize,
    };
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getFileUploadUrl",
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

import { env } from "../../lib/env.js";
import logger from "../../lib/logger.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const getEmbedding = async (query) => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
      encoding_format: "float",
    });

    console.log(response.data[0].embedding);
    return response.data[0].embedding;
  } catch (error) {
    throw error;
  }
};

// await getEmbedding("Your text string goes here");

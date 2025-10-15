import path from "path";
import dotenv from "dotenv";

const __dirname = path.resolve();

const { parsed } = dotenv.config({
  path: path.join(__dirname, "../.env"),
});

export const env = { ...parsed, ...process.env };

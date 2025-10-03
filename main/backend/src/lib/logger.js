import db from "./db.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const logToSupabase = async (log) => {
  const { data, error } = await db.from("logs").insert([
    {
      level: log.level,
      message: log.message,
      function: log.function || null,
      location: log.location,
      timestamp: log.timestamp,
    },
  ]);
};

async function logger(error) {
  const { level, message, func, location } = error;
  const log = {
    timestamp: new Date().toISOString(),
    level,
    message,
    function: func,
    location,
  };
  console.log(log);

  // await logToSupabase(log);
}

export default logger;

async function test(a) {
  try {
    logger({
      level: "info",
      message: "User Logged In",
      location: __filename,
      func: "login",
    });

    const { data, error } = await db.from("niggas").select();
    if (error) throw error;
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "test",
    });
  }
}
// test(0);

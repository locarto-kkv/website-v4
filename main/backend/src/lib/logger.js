import db from "./db.js";

function parseErrorStack(err) {
  if (!err.stack) return {};

  const stackLines = err.stack.split("\n");
  const firstStackLine = stackLines[1]?.trim();
  if (!firstStackLine) return {};

  // Case 1: "at function (file:line:col)"
  let match = firstStackLine.match(/at (.+?) \((.+):(\d+):(\d+)\)/);

  if (match) {
    return {
      functionName: match[1],
      filePath: match[2],
      line: Number(match[3]),
      column: Number(match[4]),
    };
  }

  // Case 2: "at file:line:col" (no function name)
  match = firstStackLine.match(/at (.+):(\d+):(\d+)/);
  if (match) {
    return {
      functionName: null,
      filePath: match[1],
      line: Number(match[2]),
      column: Number(match[3]),
    };
  }

  // Case 3: unrecognized
  return {};
}

export const logBackendError = async (err, req, res, next) => {
  const { functionName, filePath, line, column } = parseErrorStack(err);

  const errorLog = {
    user_id: req.user?.id || null,
    endpoint: req.originalUrl,
    method: req.method,
    message: err.message,
    name: err.name,
    stack: err.stack,
    functionName,
    filePath,
    line,
    column,
    metadata: {
      headers: req.headers,
      body: req.body,
    },
    timestamp: new Date(),
  };

  // Save to Supabase
  //   await db.from("backend_error_logs").insert(errorLog);

  return errorLog;
};

const getSeverity = (code) => {
  if (!code) return "error";

  // Critical errors
  const criticalCodes = ["57P01", "53300", "28000"];
  if (criticalCodes.includes(code)) return "critical";

  // Warnings
  const warningCodes = ["23505", "22001"]; // duplicate key, value too long
  if (warningCodes.includes(code)) return "warning";

  // All others
  return "error";
};

const getCallerStack = () => {
  const obj = {};
  Error.captureStackTrace(obj, getCallerStack);
  return obj.stack;
};

export const logSupabaseError = async (supabaseError, context = {}) => {
  const callerStack = getCallerStack();
  const { functionName, filePath, line, column } = parseErrorStack(callerStack);

  const severity = getSeverity(supabaseError.code);

  const errorLog = {
    user_id: context.userId || null,
    table_name: context.table || null,
    action: context.action || null,
    message: supabaseError.message,
    code: supabaseError.code,
    details: supabaseError.details,
    hint: supabaseError.hint,
    severity,
    function_name: functionName,
    file_path: filePath,
    line,
    column,
    query: context.query || null,
    created_at: new Date(),
  };

  // Save to Supabase
  // await db.from("supabase_error_logs").insert(errorLog);

  return errorLog;
};

export const safeQuery = async (promise, context) => {
  const { data, error } = await promise;
  if (error) {
    logSupabaseError(error, context).catch(console.error);
    throw new Error(error.message); // rethrow if you want caller to handle it
  }
  return data;
};

import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

const apiKey = env.SUPABASE_API_KEY;
const projectURL = env.SUPABASE_PROJECT_URL;

const supabase = createClient(projectURL, apiKey);

export default supabase;

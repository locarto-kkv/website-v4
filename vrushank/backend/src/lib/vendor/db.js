import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.SUPABASE_API_KEY;
const projectURL = process.env.SUPABASE_PROJECT_URL;

const supabase = createClient(projectURL, apiKey);

export default supabase;

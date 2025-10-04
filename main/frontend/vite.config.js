import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // 1️⃣ Define the path to the main .env file
  const envDir = path.resolve(__dirname, "../"); // points to main/.env

  // 2️⃣ Load all variables from that .env
  const env = loadEnv(mode, envDir, "");

  // 3️⃣ Return Vite config
  return {
    plugins: [react()],
    define: {
      // Only expose frontend vars prefixed with VITE_ to the React app
      "import.meta.env.VITE_BACKEND_URL": JSON.stringify(env.VITE_BACKEND_URL),
      "import.meta.env.VITE_SUPABASE_PROJECT_URL": JSON.stringify(
        env.VITE_SUPABASE_PROJECT_URL
      ),
      // Add more VITE_ variables here if needed
    },
  };
});

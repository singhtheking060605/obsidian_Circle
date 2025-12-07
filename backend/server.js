// ✅ NAMED IMPORT: Matches 'export const app' in app.js
import { app } from "./app.js"; 
import { connectDatabase } from "./config/database.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 1. Handle File Paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Load Environment Variables
dotenv.config({ path: path.join(__dirname, ".env") });

// 3. Connect to Database
connectDatabase();

// 4. Start Server
// Uses PORT from .env (should be 4000) or defaults to 4000
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`\n================================`);
  console.log(`🚀 Server is running!`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`================================\n`);
});

// 5. Handle Crash Events
process.on("unhandledRejection", (err) => {
  console.log(`❌ Unhandled Error: ${err.message}`);
  console.log("Shutting down server...");
  server.close(() => process.exit(1));
});
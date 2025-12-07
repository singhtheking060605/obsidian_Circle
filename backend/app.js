import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDatabase } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
console.log("🔧 Loading environment variables...");
dotenv.config({ path: path.join(__dirname, "config.env") });

// Check critical variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found!");
  process.exit(1);
}

console.log("✅ Environment loaded");
console.log("📍 MONGO_URI:", process.env.MONGO_URI ? "Found ✓" : "Missing ✗");
console.log("📍 SMTP_MAIL:", process.env.SMTP_MAIL || "Missing");

// Connect to database
connectDatabase();

export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// API Routes - MUST come before 404 handler
app.use("/api/auth", userRoutes);
app.use("/api/team", teamRoutes);

// Optional: Test route to verify routing is working
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API routes are properly configured!",
  });
});

// 404 handler - MUST be after all other routes
app.use((req, res, next) => {
  console.log(`⚠️ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler - MUST be last
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

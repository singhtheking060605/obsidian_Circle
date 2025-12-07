import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload"; // Added this back as it was missing in previous errors
import userRoutes from "./routes/userRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

// ✅ NAMED EXPORT: This matches 'import { app }' in server.js
export const app = express();

// 1. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Fix: Add fileUpload middleware if you are using it for uploads
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

// 2. CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174",
    process.env.FRONTEND_URL, 
    process.env.ADMIN_URL
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// 3. Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/task", taskRoutes);

// 4. Test Route
app.get("/", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Server is fully operational 🚀" 
  });
});

// 5. Global Error Handler (Simple version to prevent crashes)
app.use((err, req, res, next) => {
  console.error("❌ Middleware Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
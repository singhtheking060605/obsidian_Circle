import "./config/env.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import http from "http";
import { Server } from "socket.io";
import { Message } from "./models/MessageModel.js"; 

// Load from config.env in current directory
dotenv.config({ path: './config.env' });

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

// Connect to database
connectDatabase();

const PORT = process.env.PORT || 5000;

// 1. Create HTTP server from Express app
const server = http.createServer(app);

// 2. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 3. Socket Logic
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Join a specific chat session room
  socket.on("join_room", (sessionId) => {
    socket.join(sessionId);
    console.log(`User ${socket.id} joined room: ${sessionId}`);
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    try {
      await Message.create({
        session: data.sessionId,
        sender: data.senderId,
        content: data.content
      });
      
      io.in(data.sessionId).emit("receive_message", data);
    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// 4. Start Server (Only ONE listen call)
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

// REMOVED: app.listen(...) - This was causing the double-start error
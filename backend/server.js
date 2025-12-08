import "./config/env.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { cloudinary } from "./config/cloudinary.js";
import http from "http";
import { Server } from "socket.io";
import { Message } from "./models/MessageModel.js";

dotenv.config({ path: "./config.env" });

connectDatabase();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // User joins personal room
  socket.on("setup", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  // Join chat room
  socket.on("join_room", (sessionId) => {
    socket.join(sessionId);
  });

  // Send chat message
  socket.on("send_message", async (data) => {
    try {
      await Message.create({
        session: data.sessionId,
        sender: data.senderId,
        content: data.content,
      });

      io.in(data.sessionId).emit("receive_message", data);
    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  // Send request notification
  socket.on("send_request", (data) => {
    io.in(data.receiverId).emit("request_received", data);
  });

  // Accept request notification
  socket.on("accept_request", (data) => {
    io.in(data.senderId).emit("request_accepted", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

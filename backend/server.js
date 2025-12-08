import "./config/env.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import http from "http";
import { Server } from "socket.io";
import { Message } from "./models/MessageModel.js"; 

dotenv.config({ path: './config.env' });

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

  // 1. SETUP: User joins their own room (Essential for notifications)
  socket.on("setup", (userId) => {
    socket.join(userId); 
    console.log(`User ${userId} joined their personal room`);
  });

  // 2. CHAT: Join specific chat session
  socket.on("join_room", (sessionId) => {
    socket.join(sessionId);
  });

  // 3. CHAT: Send Message
  socket.on("send_message", async (data) => {
    try {
      await Message.create({
        session: data.sessionId,
        sender: data.senderId,
        content: data.content
      });
      // Broadcast to everyone in the chat room
      io.in(data.sessionId).emit("receive_message", data);
    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  // 4. NEW REQUEST: Notify Receiver
  socket.on("send_request", (data) => {
    // data = { receiverId, senderName, ... }
    io.in(data.receiverId).emit("request_received", data);
  });

  // 5. ACCEPT REQUEST: Notify Sender (NEW FIX)
  socket.on("accept_request", (data) => {
    // data = { senderId, session }
    // Notify the person who sent the request that it's accepted
    io.in(data.senderId).emit("request_accepted", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
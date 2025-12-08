import { ChatSession } from "../models/ChatSessionModel.js";
import { Message } from "../models/MessageModel.js";
import { User } from "../models/userModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

// --- SEARCH USERS ---
export const searchUsers = catchAsyncError(async (req, res, next) => {
  const { query } = req.query;
  if (!query) return res.status(200).json({ success: true, users: [] });

  const users = await User.find({
    $and: [
      { _id: { $ne: req.user._id } },
      {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } }
        ]
      }
    ]
  }).select("name email roles company roleTitle avatar");

  res.status(200).json({ success: true, users });
});

// --- SEND REQUEST ---
export const createRequest = catchAsyncError(async (req, res, next) => {
  const { receiverId, topic } = req.body;
  if (!receiverId) return next(new ErrorHandler("Receiver ID required", 400));

  // Check if session already exists (Pending OR Active)
  const existingSession = await ChatSession.findOne({
    $or: [
      { sender: req.user._id, receiver: receiverId },
      { sender: receiverId, receiver: req.user._id }
    ],
    status: { $in: ['pending', 'active'] }
  });

  if (existingSession) {
    return next(new ErrorHandler("Connection already exists or is pending.", 400));
  }

  const session = await ChatSession.create({
    sender: req.user._id,
    receiver: receiverId,
    topic: topic || "Connection Request",
    status: 'pending'
  });

  res.status(201).json({ success: true, session });
});

// --- ACCEPT REQUEST ---
export const acceptRequest = catchAsyncError(async (req, res, next) => {
  const { sessionId } = req.body;
  let session = await ChatSession.findById(sessionId);
  if (!session) return next(new ErrorHandler("Request not found", 404));

  if (session.receiver.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized", 403));
  }

  session.status = 'active';
  session.updatedAt = Date.now();
  await session.save();
  await session.populate(['sender', 'receiver']);

  res.status(200).json({ success: true, session });
});

// --- GET NETWORK STATUS (For Alumni Page) ---
// Returns ONLY "Connection Request" topics for incoming
export const getNetworkStatus = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  // 1. Incoming Connection Requests
  const incoming = await ChatSession.find({ 
    receiver: userId, 
    status: 'pending',
    topic: 'Connection Request' // <--- STRICT FILTER
  }).populate('sender', 'name email roles company roleTitle');

  // 2. Sent Requests
  const sent = await ChatSession.find({ 
    sender: userId, 
    status: 'pending' 
  }).select('receiver');

  // 3. Active Connections
  const connected = await ChatSession.find({ 
    $or: [{ sender: userId }, { receiver: userId }], 
    status: 'active' 
  }).select('sender receiver');

  res.status(200).json({ 
    success: true, 
    incoming, 
    sent: sent.map(s => s.receiver.toString()), 
    connected: connected.map(s => s.sender.toString() === userId.toString() ? s.receiver.toString() : s.sender.toString())
  });
});

// --- GET INCOMING REQUESTS (For QnA Page) ---
// Returns ONLY NON-"Connection Request" topics
export const getIncomingRequests = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const requests = await ChatSession.find({ 
    receiver: userId, 
    status: 'pending',
    topic: { $ne: 'Connection Request' } // <--- STRICT FILTER (Not connection requests)
  }).populate('sender', 'name email roles company roleTitle');

  res.status(200).json({ success: true, requests });
});

// --- GET MESSAGES (For Chat Page) ---
export const getMessages = catchAsyncError(async (req, res, next) => {
  const messages = await Message.find({ session: req.params.sessionId })
    .populate('sender', 'name')
    .sort({ createdAt: 1 });
  res.status(200).json({ success: true, messages });
});

// --- GET MY CHATS (For Sidebar/List) ---
export const getMyChats = catchAsyncError(async (req, res, next) => {
  const sessions = await ChatSession.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    status: 'active'
  })
  .populate('sender', 'name email roles')
  .populate('receiver', 'name email roles')
  .sort({ updatedAt: -1 });

  res.status(200).json({ success: true, sessions });
});
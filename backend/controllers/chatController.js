import { ChatSession } from "../models/ChatSessionModel.js";
import { Message } from "../models/MessageModel.js";
import { User } from "../models/userModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

// --- SEARCH USERS ---
export const searchUsers = catchAsyncError(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new ErrorHandler("Please enter a name or email to search", 400));
  }

  // Find users by name or email, excluding the current user
  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } }
    ],
    _id: { $ne: req.user._id }
  }).select("name email roles avatar"); // Select only necessary fields

  res.status(200).json({ success: true, users });
});

// --- CREATE REQUEST ---
export const createRequest = catchAsyncError(async (req, res, next) => {
  const { receiverId, topic, teamId } = req.body;

  if (!receiverId) {
    return next(new ErrorHandler("Receiver ID is required", 400));
  }

  // Check if session already exists
  const existingSession = await ChatSession.findOne({
    $or: [
      { sender: req.user._id, receiver: receiverId },
      { sender: receiverId, receiver: req.user._id }
    ],
    status: { $in: ['pending', 'active'] }
  });

  if (existingSession) {
    return next(new ErrorHandler("A chat session already exists with this user.", 400));
  }

  const session = await ChatSession.create({
    sender: req.user._id,
    receiver: receiverId,
    team: teamId || null, // Optional
    topic: topic || "General Discussion",
    status: 'pending'
  });

  res.status(201).json({ success: true, session });
});

// --- ACCEPT REQUEST ---
export const acceptRequest = catchAsyncError(async (req, res, next) => {
  const { sessionId } = req.body;

  let session = await ChatSession.findById(sessionId);
  if (!session) return next(new ErrorHandler("Session not found", 404));

  // Security: Only the receiver can accept
  if (session.receiver.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You are not authorized to accept this request.", 403));
  }

  session.status = 'active';
  session.updatedAt = Date.now();
  await session.save();

  // Populate info for frontend
  await session.populate(['sender', 'receiver']);

  res.status(200).json({ success: true, session });
});

// --- GET PENDING REQUESTS (INCOMING) ---
export const getIncomingRequests = catchAsyncError(async (req, res, next) => {
  const requests = await ChatSession.find({ 
    status: 'pending',
    receiver: req.user._id 
  })
    .populate('sender', 'name email roles')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, requests });
});

// --- GET ACTIVE CHATS ---
export const getMyChats = catchAsyncError(async (req, res, next) => {
  const query = {
    $or: [
      { sender: req.user._id },
      { receiver: req.user._id }
    ],
    status: 'active'
  };

  const sessions = await ChatSession.find(query)
    .populate('sender', 'name email roles')
    .populate('receiver', 'name email roles')
    .sort({ updatedAt: -1 });

  res.status(200).json({ success: true, sessions });
});

// --- GET MESSAGES ---
export const getMessages = catchAsyncError(async (req, res, next) => {
  const messages = await Message.find({ session: req.params.sessionId })
    .populate('sender', 'name')
    .sort({ createdAt: 1 });

  res.status(200).json({ success: true, messages });
});
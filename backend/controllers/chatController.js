import { ChatSession } from "../models/ChatSessionModel.js";
import { Message } from "../models/MessageModel.js";
import { User } from "../models/userModel.js"; // Import User model
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

// Student creates a help request for a SPECIFIC mentor
export const createRequest = catchAsyncError(async (req, res, next) => {
  const { teamId, topic, mentorEmail } = req.body; // Added mentorEmail

  if (!mentorEmail) {
    return next(new ErrorHandler("Please provide the Mentor's email address.", 400));
  }

  // Find the mentor
  const mentor = await User.findOne({ email: mentorEmail });
  
  if (!mentor) {
    return next(new ErrorHandler("Mentor not found with that email.", 404));
  }

  // Optional: Verify the user is actually a mentor
  if (!mentor.roles.includes('Mentor') && !mentor.roles.includes('Admin')) {
    return next(new ErrorHandler("The user with this email is not a Mentor.", 400));
  }
  
  const session = await ChatSession.create({
    team: teamId,
    student: req.user._id,
    mentor: mentor._id, // Assign immediately
    topic,
    status: 'pending'
  });

  res.status(201).json({ success: true, session });
});

// Mentor accepts a request
export const acceptRequest = catchAsyncError(async (req, res, next) => {
  const { sessionId } = req.body;

  let session = await ChatSession.findById(sessionId);
  if (!session) return next(new ErrorHandler("Session not found", 404));

  // Security check: Ensure the logged-in mentor is the one requested
  if (session.mentor.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("This request was not sent to you.", 403));
  }

  if (session.status !== 'pending') {
    return next(new ErrorHandler("Session already active or closed", 400));
  }

  session.status = 'active';
  session.updatedAt = Date.now();
  await session.save();

  await session.populate(['student', 'team', 'mentor']);

  res.status(200).json({ success: true, session });
});

// Get requests ONLY for the logged-in Mentor
export const getAllRequests = catchAsyncError(async (req, res, next) => {
  const requests = await ChatSession.find({ 
    status: 'pending',
    mentor: req.user._id // Filter by current mentor
  })
    .populate('student', 'name email')
    .populate('team', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, requests });
});

// Get active chats
export const getMyChats = catchAsyncError(async (req, res, next) => {
  const query = {
    $or: [
      { student: req.user._id },
      // For mentors, only show chats that are NOT pending in the main chat list
      // Pending ones are in the "Requests" tab
      { 
        mentor: req.user._id,
        status: { $ne: 'pending' } 
      }
    ]
  };

  const sessions = await ChatSession.find(query)
    .populate('student', 'name')
    .populate('mentor', 'name')
    .populate('team', 'name')
    .sort({ updatedAt: -1 });

  res.status(200).json({ success: true, sessions });
});

// Get messages for a specific session
export const getMessages = catchAsyncError(async (req, res, next) => {
  const messages = await Message.find({ session: req.params.sessionId })
    .populate('sender', 'name')
    .sort({ createdAt: 1 });

  res.status(200).json({ success: true, messages });
});
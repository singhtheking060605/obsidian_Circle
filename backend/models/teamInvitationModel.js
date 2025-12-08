import mongoose from 'mongoose';
import crypto from 'crypto';

const teamInvitationSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate invitation token
teamInvitationSchema.methods.generateToken = function() {
  this.token = crypto.randomBytes(32).toString('hex');
  return this.token;
};

// Check if invitation is expired
teamInvitationSchema.methods.isExpired = function() {
  return Date.now() > this.expiresAt;
};

export const TeamInvitation = mongoose.model('TeamInvitation', teamInvitationSchema);
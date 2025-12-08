import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: [true, "Please provide a reason for the referral"],
    trim: true
  },
  // Specific links to PRs, Project Demos, or Task Submissions
  evidenceLinks: [{
    type: String,
    trim: true
  }],
  // Context of where this student was observed (e.g., "Team Alpha - Operation Hawkins")
  context: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Official'],
    default: 'Official'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Referral = mongoose.model('Referral', referralSchema);
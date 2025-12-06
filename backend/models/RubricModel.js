import mongoose from 'mongoose';

const rubricSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a title for the Rubric.'],
    trim: true,
  },
  description: {
    type: String,
    default: 'A standard evaluation rubric.',
  },
  criteria: [
    {
      criterionName: {
        type: String,
        required: [true, 'Criterion name is required.'],
      },
      maxScore: {
        type: Number,
        required: [true, 'Maximum score is required for the criterion.'],
        default: 10,
        min: [1, 'Max score must be at least 1'],
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Rubric = mongoose.model('Rubric', rubricSchema);
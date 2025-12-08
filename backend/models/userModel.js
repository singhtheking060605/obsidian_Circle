import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  // Core Identity
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    trim: true,
    lowercase: true,
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  password: { 
    type: String, 
    required: [true, "Please enter your password"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },

  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
  },

  phone: {
    type: String,
    required: [true, "Please enter your phone number"],
    unique: true,
    trim: true,
  },

  // Added from other branch
  branch: {
    type: String,
    trim: true
  },

  rollNumber: {
    type: String,
    trim: true
  },

  // Role Management
  roles: [
    {
      type: String,
      enum: ["Mentor", "Student"],
      default: "Student",
    },
  ],

  // Status
  status: {
    type: String,
    enum: ["Active", "Banned", "Restricted", "Pending"],
    default: "Pending",
  },

  isAlumnus: {
    type: Boolean,
    default: false,
  },

  // Verification
  accountVerified: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: Number,
  },
  verificationCodeExpire: {
    type: Date,
  },

  profilePhoto: {
    type: String,
    default: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  },

  resume: {
    type: String,
  },

  bio: {
    type: String,
    maxlength: [500, "Bio cannot exceed 500 characters"],
  },

  github: {
    type: String,
    trim: true,
  },

  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Update timestamp on save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate verification code
userSchema.methods.generateVerificationCode = function () {
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return parseInt(firstDigit + remainingDigits);
  }
  
  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return verificationCode;
};

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate reset password token
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
  return resetToken;
};

// Mentor Profile Schema
const mentorProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  company: { 
    type: String, 
    trim: true 
  },
  roleTitle: { 
    type: String, 
    trim: true 
  },
  expertiseList: [{ 
    type: String 
  }],
  contactInfo: { 
    type: String 
  },
  verificationStatus: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending' 
  },
  bio: {
    type: String,
    maxlength: 500
  },
  linkedIn: String,
  github: String,
  portfolio: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});


const User = mongoose.models.User || mongoose.model('User', userSchema);
const MentorProfile = mongoose.models.MentorProfile || mongoose.model('MentorProfile', mentorProfileSchema);

export { User, MentorProfile };

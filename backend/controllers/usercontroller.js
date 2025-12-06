import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Validate phone number
function validatePhoneNumber(phone) {
  const phoneRegex = /^\+91[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

// Generate email template
function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #1a1a1a;">
      <h2 style="color: #ef4444; text-align: center; text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);">The Obsidian Circle</h2>
      <h3 style="color: #ef4444; text-align: center;">Verification Code</h3>
      <p style="font-size: 16px; color: #e5e5e5;">Dear User,</p>
      <p style="font-size: 16px; color: #e5e5e5;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #ef4444; padding: 15px 30px; border: 2px solid #ef4444; border-radius: 8px; background-color: #2a2a2a; text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #e5e5e5;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #e5e5e5;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>The Obsidian Circle Team</p>
        <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}

// Send verification code (FIXED - now async and awaits email)
async function sendVerificationCode(
  verificationMethod,
  verificationCode,
  name,
  email,
  phone,
  res
) {
  try {
    if (verificationMethod === "email") {
      const message = generateEmailTemplate(verificationCode);
      
      // AWAIT the email sending
      await sendEmail({ 
        email, 
        subject: "The Obsidian Circle - Verification Code", 
        message 
      });
      
      console.log('✅ Verification email sent to:', email);
      
      res.status(200).json({
        success: true,
        message: `Verification email successfully sent to ${email}`,
      });
    } else if (verificationMethod === "phone") {
      const verificationCodeWithSpace = verificationCode
        .toString()
        .split("")
        .join(" ");
      
      await client.calls.create({
        twiml: `<Response><Say>Your verification code for The Obsidian Circle is ${verificationCodeWithSpace}. I repeat, ${verificationCodeWithSpace}.</Say></Response>`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      
      console.log('✅ Verification call sent to:', phone);
      
      res.status(200).json({
        success: true,
        message: `OTP sent to ${phone}`,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Invalid verification method.",
      });
    }
  } catch (error) {
    console.error('❌ Error sending verification code:', error);
    return res.status(500).json({
      success: false,
      message: `Verification code failed to send: ${error.message}`,
    });
  }
}

// Register user (FIXED - now awaits sendVerificationCode)
export const register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, phone, password, verificationMethod, role } = req.body;
    
    console.log('📝 Registration attempt:', { name, email, phone, verificationMethod, role });
    
    if (!name || !email || !phone || !password || !verificationMethod) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    if (!validatePhoneNumber(phone)) {
      return next(new ErrorHandler("Invalid phone number. Must be in format: +91XXXXXXXXXX", 400));
    }

    const existingUser = await User.findOne({
      $or: [
        { email, accountVerified: true },
        { phone, accountVerified: true },
      ],
    });

    if (existingUser) {
      return next(new ErrorHandler("Phone or Email is already registered.", 400));
    }

    const registerationAttemptsByUser = await User.find({
      $or: [
        { phone, accountVerified: false },
        { email, accountVerified: false },
      ],
    });
    
    if (registerationAttemptsByUser.length > 3) {
      return next(
        new ErrorHandler(
          "You have exceeded the maximum number of attempts (3). Please try again after 30 minutes.",
          400
        )
      );
    }

    const userData = {
      name,
      email,
      phone,
      password,
      roles: role ? [role] : ['Student'] // Use provided role or default to Student
    };

    console.log('👤 Creating user with data:', userData);

    const user = await User.create(userData);
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    
    console.log('🔢 Generated verification code:', verificationCode);
    
    // AWAIT the verification code sending
    await sendVerificationCode(
      verificationMethod,
      verificationCode,
      name,
      email,
      phone,
      res
    );
  } catch (error) {
    console.error('❌ Registration error:', error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// Verify OTP
export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp, phone } = req.body;

  console.log('🔐 OTP verification attempt:', { email, phone, otp });

  if (!validatePhoneNumber(phone)) {
    return next(new ErrorHandler("Invalid phone number.", 400));
  }

  try {
    const userAllEntries = await User.find({
      $or: [
        { email, accountVerified: false },
        { phone, accountVerified: false },
      ],
    }).sort({ createdAt: -1 });

    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new ErrorHandler("User not found.", 404));
    }

    let user;

    if (userAllEntries.length > 1) {
      user = userAllEntries[0];
      await User.deleteMany({
        _id: { $ne: user._id },
        $or: [
          { phone, accountVerified: false },
          { email, accountVerified: false },
        ],
      });
    } else {
      user = userAllEntries[0];
    }

    console.log('🔍 Found user verification code:', user.verificationCode);
    console.log('📥 Received OTP:', otp);

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP.", 400));
    }

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();
    
    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP Expired. Please retry.", 400));
    }

    user.accountVerified = true;
    user.emailVerified = true;
    user.status = 'Active';
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });

    console.log('✅ Account verified successfully');

    sendToken(user, 200, "Account verified successfully.", res);
  } catch (error) {
    console.error('❌ OTP verification error:', error);
    return next(new ErrorHandler("Internal Server Error.", 500));
  }
});

// Login user
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }
  
  const user = await User.findOne({ email, accountVerified: true }).select("+password");
  
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  
  const isPasswordMatched = await user.comparePassword(password);
  
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  
  sendToken(user, 200, "User logged in successfully.", res);
});

// Logout user
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

// Forgot password
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });
  
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "The Obsidian Circle - Reset Password",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Cannot send reset password token.", 500));
  }
});

// Reset password
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
    
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  
  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has expired.", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password & confirm password do not match.", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, "Password reset successfully.", res);
});

// Get user profile
export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
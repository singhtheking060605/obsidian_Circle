import fs from "fs";
import { promisify } from "util";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userModel.js";
import { validatePhoneNumber } from "../utils/validation.js";
import uploadToExternalService from "../utils/cloudinaryUploader.js";

const unlinkAsync = promisify(fs.unlink);

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const { name, phone, bio, github } = req.body;
  const files = req.files;

  // 1. Find the current user document
  const user = await User.findById(userId).select("+password");
  if (!user) {
    if (files?.profilePhoto)
      await unlinkAsync(files.profilePhoto[0].path).catch(() => {});
    if (files?.resume) await unlinkAsync(files.resume[0].path).catch(() => {});
    return next(new ErrorHandler("User not found.", 404));
  }

  // 2. Process File Uploads to Cloudinary
  let newProfilePhotoUrl = null;
  let newResumeUrl = null;

  try {
    if (files && files.profilePhoto && files.profilePhoto.length > 0) {
      const filePath = files.profilePhoto[0].path;
      newProfilePhotoUrl = await uploadToExternalService(filePath, "image");
    }

    if (files && files.resume && files.resume.length > 0) {
      const filePath = files.resume[0].path;
      newResumeUrl = await uploadToExternalService(filePath, "auto");
    }
  } catch (err) {
    return next(
      new ErrorHandler(err.message || "Failed to upload files.", 500)
    );
  }

  // 3. Update Mongoose document properties (Validation logic now accessible)
  if (name) user.name = name;
  if (bio) user.bio = bio;
  if (github) user.github = github;

  if (phone) {
    // Use the imported validation utility
    if (!validatePhoneNumber(phone)) {
      return next(
        new ErrorHandler(
          "Invalid phone number. Must be in format: +91XXXXXXXXXX",
          400
        )
      );
    }
    user.phone = phone;
  }

  if (newProfilePhotoUrl) user.profilePhoto = newProfilePhotoUrl;
  if (newResumeUrl) user.resume = newResumeUrl;

  if (!user.isModified()) {
    return next(new ErrorHandler("No changes detected to save.", 400));
  }

  // 4. Save the updated user document
  
try {
    console.log('Attempting to save user fields:', {
        name: user.name, 
        phone: user.phone, 
        bio: user.bio, 
        github: user.github, 
        profilePhoto: user.profilePhoto, 
        resume: user.resume
    });
    
    await user.save({ validateModifiedOnly: true });

     const updatedUserObject = user.toObject({ getters: true, virtuals: true });
    delete updatedUserObject.password;
    
    res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: updatedUserObject
    });
} catch (saveError) {
    // This logs the Mongoose validation error if save() fails
    console.error('🚨 Mongoose Save Error:', saveError.message);
    return next(new ErrorHandler("Database validation failed or other save error.", 500));
}
});

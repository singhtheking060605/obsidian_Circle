import { cloudinary } from "../config/cloudinary.js"; 
import fs from "fs";
import { promisify } from "util";

// Promisify fs.unlink to allow using await for file deletion
const unlinkAsync = promisify(fs.unlink);

async function uploadToExternalService(filePath, resourceType) {
  if (!filePath) return null;

  let secureUrl = null;

  try {
    const options = {
      resource_type: resourceType,
      folder: `obsidian_circle_uploads/${resourceType}`,
    };

    const result = await cloudinary.uploader.upload(filePath, options);
    // Extract the permanent URL
    secureUrl = result.secure_url;
   

    console.log(`✅ Cloudinary Upload Success! Public ID: ${result.public_id}`);
  } catch (error) {
    console.error(`❌ Cloudinary Upload Failed (File: ${filePath}):`, error);
    throw new Error(`File upload to Cloudinary failed: ${error.message}`);
  } finally {
    await unlinkAsync(filePath).catch((err) => {
      console.error(`Error deleting temp file ${filePath}:`, err.message);
    });
    console.log(`🧹 Temporary file cleanup complete for: ${filePath}`);
  }

  return secureUrl;
}

export default uploadToExternalService;

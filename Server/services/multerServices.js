import path from "path";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const upload_image = async (file) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "uploads" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });

    return result.secure_url;
  } catch (error) {
    console.log("Cloudinary upload error:", error.message);
    throw error;
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default cloudinary;

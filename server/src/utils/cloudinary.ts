import { v2 as cloudinary, v2 } from "cloudinary";
import "dotenv/config";

v2.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

export const uploadFile = async (filePath: string, folder: string) => {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: `/pms/${folder}`,
    });

    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteFile = async (public_id: string) => {
  try {
    const res = await cloudinary.uploader.destroy(public_id);

    return res;
  } catch (error) {
    return false;
  }
};

import { v2 as cloudinary, v2 } from "cloudinary";

v2.config({
  api_key: "391947534714284",
  api_secret: "7PePq8YF8zQxrpu6PMhbo5dBnHY",
  cloud_name: "bikramjeet",
});

export const uploadFile = async (filePath: string, folder: string) => {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: `/pms/${folder}`,
    });

    return res;
  } catch (error) {
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

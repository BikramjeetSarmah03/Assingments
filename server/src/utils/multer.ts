import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage });

export const multiUpload = (name = "files", length = 1) =>
  upload.array(name, length);

export const singleUpload = (name = "file") => upload.single(name);

export const removeFileFromDisk = (filePath: string) => {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(filePath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

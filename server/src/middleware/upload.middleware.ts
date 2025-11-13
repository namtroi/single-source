import multer from "multer";

// Store in memory (buffer)
const storage = multer.memoryStorage();

function fileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed"));
  }
  cb(null, true);
}

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
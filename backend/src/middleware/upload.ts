import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define uploads directory at project root
const uploadsDir = path.join(process.cwd(), 'uploads');
// Create the directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Export the configured upload middleware
const upload = multer({ storage });
export default upload;

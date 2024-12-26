import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    upload.single('profileImage')(req, res, (err) => {
      if (err) {
        res.status(500).json({ error: `Failed to upload image: ${err.message}` });
        return reject(err);
      }

      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return reject(new Error('No file uploaded'));
      }

      const filePath = `/uploads/${req.file.filename}`;
      res.status(200).json({ message: 'Profile image uploaded successfully', filePath });
      return resolve();
    });
  });
}

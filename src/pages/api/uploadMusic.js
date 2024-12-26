import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname
      .replace(/\s+/g, '-') 
      .replace(/[^a-zA-Z0-9.-]/g, ''); 

    const uniqueSuffix = `${Date.now()}`;
    const fileName = `${uniqueSuffix}-${originalName}`;

    cb(null, fileName); 
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default function handler(req, res) {
  const uploadPath = path.join(process.cwd(), 'public/uploads'); 

  if (req.method === 'POST') {
    const uploadMiddleware = upload.single('musicFile');

    uploadMiddleware(req, res, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'File upload failed' });
      }
      const filePath = `/uploads/${req.file.filename}`;
      res.status(200).json({ filePath, name: req.file.filename }); 
    });
  } else if (req.method === 'GET') {
    try {
      const files = fs.readdirSync(uploadPath); 
      const mp3Files = files
        .filter((file) => path.extname(file).toLowerCase() === '.mp3') 
        .map((file) => {
          const timestamp = parseInt(file.split('-')[0], 10); 
          return {
            id: file, 
            name: file, 
            url: `/uploads/${file}`, 
            timestamp, 
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp); 
  
      res.status(200).json(mp3Files); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read uploaded files' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

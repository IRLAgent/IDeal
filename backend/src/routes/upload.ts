import { Router, Response } from 'express';
import multer from 'multer';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { uploadToCloudinary } from '../utils/cloudinary';

const router = Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Upload multiple images endpoint
router.post(
  '/',
  authMiddleware,
  upload.array('files', 10), // Max 10 files
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files provided' });
      }

      const files = req.files as Express.Multer.File[];
      const uploadPromises = files.map((file) =>
        uploadToCloudinary(file.buffer, file.originalname)
      );

      const results = await Promise.all(uploadPromises);
      const urls = results.map((result) => result.url);

      res.json({ urls });
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Failed to upload files';
      res.status(500).json({ 
        error: errorMessage,
        details: error.toString()
      });
    }
  }
);

export default router;

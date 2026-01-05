import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary (Explicit parse for robustness)
if (process.env.CLOUDINARY_URL) {
  const matches = process.env.CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (matches) {
    cloudinary.config({
      cloud_name: matches[3],
      api_key: matches[1],
      api_secret: matches[2]
    });
  }
}

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campus_mart_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

// Init Upload
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).array('images', 5);

const uploadImages = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(400).json({ success: false, message: err.message });
    } else {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No file selected' });
      } else {
        // Cloudinary returns the full URL in `path` (or `secure_url` on the file object)
        const fileUrls = req.files.map(file => file.path);
        
        return res.status(200).json({
          success: true,
          message: 'Files uploaded!',
          data: fileUrls
        });
      }
    }
  });
};

export { uploadImages };

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const { ErrorHandler } = require('./errorHandler');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp|gif/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && filetypes.test(mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'), false);
};

// Initialize multer with configuration
const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware for handling single file upload
const uploadSingle = (fieldName) => (req, res, next) => {
  const uploadSingleFile = upload.single(fieldName);
  
  uploadSingleFile(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return next(new ErrorHandler(400, err.message));
    } else if (err) {
      // An unknown error occurred
      return next(new ErrorHandler(500, err.message));
    }
    
    // File uploaded successfully
    if (req.file) {
      // Convert file path to URL
      req.file.url = `/uploads/${req.file.filename}`;
    }
    
    next();
  });
};

// Middleware for handling multiple file uploads
const uploadMultiple = (fieldName, maxCount = 5) => (req, res, next) => {
  const uploadMultipleFiles = upload.array(fieldName, maxCount);
  
  uploadMultipleFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(new ErrorHandler(400, err.message));
    } else if (err) {
      return next(new ErrorHandler(500, err.message));
    }
    
    // Convert file paths to URLs
    if (req.files && req.files.length > 0) {
      req.files = req.files.map(file => ({
        ...file,
        url: `/uploads/${file.filename}`
      }));
    }
    
    next();
  });
};

// Delete file utility
const deleteFile = async (filePath) => {
  const fullPath = path.join(uploadDir, filePath);
  try {
    await promisify(fs.unlink)(fullPath);
    return true;
  } catch (err) {
    console.error(`Error deleting file ${filePath}:`, err);
    return false;
  }
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  deleteFile,
  uploadDir,
};

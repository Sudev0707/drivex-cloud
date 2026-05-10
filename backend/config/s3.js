// backend/config/s3.js
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create S3 instance
const s3 = new AWS.S3();

// File filter - specify allowed file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
  }
};

// Configure S3 storage
const storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME,
  acl: 'public-read', // Make files publicly accessible
  metadata: (req, file, cb) => {
    cb(null, { 
      fieldName: file.fieldname,
      uploadedBy: req.user?.id || 'unknown',
      originalName: file.originalname
    });
  },
  key: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `drivex-lite/${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// Create multer upload instance with limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: fileFilter,
});

// Helper function to delete file from S3
const deleteFromS3 = async (fileUrl) => {
  try {
    // Extract key from URL
    const key = fileUrl.split('.amazonaws.com/')[1];
    if (!key) return false;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    
    await s3.deleteObject(params).promise();
    console.log(`Deleted file: ${key}`);
    return true;
  } catch (error) {
    console.error('Error deleting from S3:', error);
    return false;
  }
};

// Helper function to generate signed URL for private files
const getSignedUrl = (key, expiresIn = 3600) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: expiresIn, // URL expires in seconds
  };
  return s3.getSignedUrl('getObject', params);
};

module.exports = { upload, s3, deleteFromS3, getSignedUrl };
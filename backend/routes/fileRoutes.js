import express from 'express';
import fileController from '../controller/fileController.js';
import multer from 'multer';
import path from 'path';
const router = express.Router();

const {getAllFiles, uploadFile, downloadFile, serveFile, deleteFile, createFolder} = fileController;

// Set up multer for file storage
const storage = multer.diskStorage({
    // destination folder for uploaded files: upload in backend root
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
  
const upload = multer({ 
    storage: storage,
    limits: {fileSize: 1000000}, //1MB size
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
 });

// Check file type
const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf|json/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('These files only-(jpeg, jpg, png, gif, json, pdf)');
    }
}

// Route to get all uploaded files
router.route('/').get(getAllFiles);

// Route to upload a file
router.route('/upload').post(upload.single('file'), uploadFile);

// Route to download a file
router.route('/download/:id').get(downloadFile);

// Route to open a file
router.route('/:id').get(serveFile); 

router.route('/delete/:id').delete(deleteFile)

router.route('/create').post(createFolder)

export default router;
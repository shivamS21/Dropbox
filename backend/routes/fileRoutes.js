import express from 'express';
import fileController from '../controller/fileController.js';
import multer from 'multer';
import path from 'path';
const router = express.Router();

const {getAllFiles, uploadFile, downloadFile, serveFile} = fileController;

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    // filename: (req, file, cb) => {
    //   cb(null, Date.now() + path.extname(file.originalname));
    // },
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
function checkFileType(file, cb) {
    console.log(file.originalname, file.mimetype)
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Images only! (jpeg, jpg, png, gif)');
    }
}
router.route('/').get(getAllFiles);

router.route('/upload').post(upload.single('file'), uploadFile);

router.route('/download/:id').get(downloadFile);

router.route('/:id').get(serveFile); 

export default router;
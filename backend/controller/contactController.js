import asyncHandler from "express-async-handler";
import File from "../models/File.js";
import multer from 'multer';
import path from 'path';

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const getAllFiles = asyncHandler(async(req, res) => {
    try {
        const files = await File.find();
        req.status(200).json(files);
    } catch(e) {
        res.status(500).json({error: 'Failed to fetch files'});
    }
})

const uploadFile = asyncHandler(async(req, res) => {
    try {
        const file = new File({
            name: req.file.name,
            path: req.file.path,
            size: req.file.size,
            mimeType: req.file.mimeType,
        })

        await file.save();
    }
})

const downloadFile = asyncHandler(async(req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({error: 'File not found!'});
        }

        res.download(file.path, file.name);
    } catch(e) {
        res.status(500).json({error: 'Failed to download file.'})
    }
})
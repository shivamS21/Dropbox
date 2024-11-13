import asyncHandler from "express-async-handler";
import MongoFile from "../models/File.js";
// const fs = require('fs');
import fs from 'fs'

const getAllFiles = asyncHandler(async(req, res) => {
    try {
        const files = await MongoFile.find();
        console.log("API files", files);
        res.status(200).json(files);
    } catch(e) {
        res.status(500).json({error: 'Failed to fetch files'});
    }
})

const uploadFile = asyncHandler(async (req, res) => {
    try {
        const file = new MongoFile({
            name: req.file.originalname, 
            path: req.file.path,
            size: req.file.size,
            mimeType: req.file.mimetype, 
        });
        console.log('file:', file);

        await file.save();
        file['__v'] = 0;
        res.status(201).json(file); 
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});


const downloadFile = asyncHandler(async(req, res) => {
    try {
        const file = await MongoFile.findById(req.params.id);
        if (!file) {
            return res.status(404).json({error: 'File not found!'});
        }

        res.set({
            'Content-Disposition': `attachment; filename="${file.name}"`,
            'Content-Type': file.mimeType,
        });
        const fileStream = fs.createReadStream(file.path);
        // res.download(file.path);
        fileStream.pipe(res);
        // var filestream = fs.createReadStream(file.name);
        // filestream.pipe(res);
    } catch(e) {
        res.status(500).json({error: 'Failed to download file.'})
    }
})

export default {getAllFiles, uploadFile, downloadFile};
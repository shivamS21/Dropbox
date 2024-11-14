import asyncHandler from "express-async-handler";
import MongoFile from "../models/File.js";
import fs from 'fs'

const getAllFiles = asyncHandler(async(req, res) => {
    try {
        const files = await MongoFile.find();
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
        console.log(file.name, file.mimeType)
        res.set({
            'Access-Control-Expose-Headers': 'Content-Disposition',
            'Content-Disposition': `attachment; filename="${file.name}"`,
            'Content-Type': file.mimeType,
        });
        console.log("Headers", res.getHeaders());

        const fileStream = fs.createReadStream(file.path);
        // res.download(file.path);
        fileStream.pipe(res);
        // var filestream = fs.createReadStream(file.name);
        // filestream.pipe(res);
    } catch(e) {
        res.status(500).json({error: 'Failed to download file.'})
    }
})

// Serve file for viewing (in new tab)
const serveFile = asyncHandler(async (req, res) => {
    try {
        const file = await MongoFile.findById(req.params.id);
        console.log('file obtained is', file);
        
        if (!file) {
            return res.status(404).json({ error: 'File not found!' });
        }

        // Resolve the full file path (using path.resolve for a cross-platform solution)
        const filePath = path.resolve('uploads', file.path);  // Adjust the path accordingly
        console.log('Resolved file path:', filePath);
        
        // Set headers for file type to view it in a new tab
        res.set('Content-Type', file.mimeType);

        // Send the file as a response to the browser
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ error: 'Failed to serve file.' });
            }
        });
    } catch (e) {
        console.error('Error in serving file:', e);
        res.status(500).json({ error: 'Failed to serve file.' });
    }
});


export default {getAllFiles, uploadFile, downloadFile, serveFile};
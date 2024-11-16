import asyncHandler from "express-async-handler";
import MongoFile from "../models/File.js";
import fs from 'fs';
import path from 'path';

/** 
 * @desc Get all Files
 * @route GET /api/files
 * @access public
 */
const getAllFiles = asyncHandler(async(req, res) => {
    try {
        const files = await MongoFile.find();
        res.status(200).json(files);
    } catch(e) {
        res.status(500).json({error: 'Failed to fetch files'});
    }
})

/** 
 * @desc Upload a file
 * @route POST /api/files/upload
 * @access public
 */
const uploadFile = asyncHandler(async (req, res) => {
    try {
        const file = new MongoFile({
            name: req.file.originalname, 
            path: req.file.path,
            size: req.file.size,
            mimeType: req.file.mimetype, 
            directory: req.body.cwd,
            isFile: true,
        });
        await file.save();
        res.status(201).json(file); 
    } catch (e) {
        console.error('Error uploading file:', e);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

/** 
 * @desc Download a file
 * @route GET /api/files/download/:id
 * @access public
 */
const downloadFile = asyncHandler(async(req, res) => {
    try {
        const file = await MongoFile.findById(req.params.id);
        if (!file) {
            return res.status(404).json({error: 'File not found!'});
        }

        res.set({
            'Access-Control-Expose-Headers': 'Content-Disposition',
            'Content-Disposition': `attachment; filename="${file.name}"`,
            'Content-Type': file.mimeType,
        });

        const fileStream = fs.createReadStream(file.path);
        fileStream.pipe(res);
    } catch(e) {
        res.status(500).json({error: 'Failed to download file.'})
    }
})

/** 
 * @desc Open the file in new tab
 * @route GET /api/files/:id
 * @access public
 */
const serveFile = asyncHandler(async (req, res) => {
    try {
        const file = await MongoFile.findById(req.params.id);
        
        if (!file) {
            return res.status(404).json({ error: 'File not found!' });
        }

        // Resolve the full file path
        const filePath = path.resolve(file.path); 
        
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

/** 
 * @desc Delete a file
 * @route DELETE /api/files/delete/:id
 * @access public
 */
const deleteFile = asyncHandler(async (req, res) => {
    try {
        const file = await MongoFile.findById(req.params.id);

        if (!file) {
            return res.status(404).json({ error: 'File not found!' });
        }

        // Delete the file from the filesystem
        const filePath = path.resolve(file.path);
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error('Error deleting file from storage:', err);
                return res.status(500).json({ error: 'Failed to delete file from storage.' });
            }

            // Delete the file from the database
            await MongoFile.deleteOne({ _id: file._id });
            res.status(200).json({ message: 'File deleted successfully' });
        });
    } catch (e) {
        console.error('Error deleting file:', e);
        res.status(500).json({ error: 'Failed to delete file.' });
    }
});

const createFolder = asyncHandler(async (req, res) => {
    try {
        const directoryName = req.body.directoryName;
        const folder = new MongoFile({
            name: directoryName, 
            directory: req.body.cwd,
            isFile: false,
        });
        await folder.save();
        res.status(201).json(folder); 
    } catch (e) {
        console.error('Error uploading file:', e);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

export default { getAllFiles, uploadFile, downloadFile, serveFile, deleteFile, createFolder };
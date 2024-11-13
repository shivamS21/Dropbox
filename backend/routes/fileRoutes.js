import express from 'express';
import fileController from '../controller/contactController.js';
const router = express.Router();

const {getAllFiles, uploadFile, downloadFile} = fileController;


router.route('/').get(getAllFiles);

router.route('/upload').post(uploadFile);

router.route('/download/:id').get(downloadFile);
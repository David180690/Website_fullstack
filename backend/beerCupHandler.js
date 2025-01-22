const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const conn = mongoose.createConnection('mongodb://localhost:27017/gfsBEER', {});

let gridFSBucketBeer; // Corrected variable name
conn.once('open', () => {
    gridFSBucketBeer = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'BeerUploads' }); // Fixed bucket name typo
    console.log('Connected to MongoDB GridFS');
});

// Multer Configuration
const storage = multer.memoryStorage(); // Store file in memory temporarily
const upload = multer({ storage });

// Routes

// Upload file
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const { originalname, buffer } = req.file;

        const writeStream = gridFSBucketBeer.openUploadStream(originalname, {
            metadata: { uploadedBy: req.body.name },
        });

        writeStream.end(buffer);

        writeStream.on('finish', () => {
            res.status(200).json({
                message: 'File uploaded successfully.',
                fileId: writeStream.id,
            });
        });

        writeStream.on('error', (err) => {
            console.error(err);
            res.status(500).send('File upload failed.');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred.');
    }
});

// Retrieve file by name
app.get('/files/:filename', (req, res) => {
    const { filename } = req.params;

    const downloadStream = gridFSBucketBeer.openDownloadStreamByName(filename);

    downloadStream.on('data', (chunk) => res.write(chunk));
    downloadStream.on('end', () => res.end());
    downloadStream.on('error', (err) => {
        console.error(err);
        res.status(404).send('File not found.');
    });
});

// Add this route to list all uploaded files
app.get('/files', async (req, res) => {
    try {
        const files = await conn.db.collection('BeerUploads.files').find().toArray(); // Corrected collection name

        if (files.length === 0) {
            return res.status(404).send('No files found.');
        }

        // Return the file names and metadata
        res.status(200).json(files.map(file => ({
            filename: file.filename,
            uploadDate: file.uploadDate,
            metadata: file.metadata,
        })));
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving files.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

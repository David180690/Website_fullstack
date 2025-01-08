const express = require('express');
const path = require('path');

require('dotenv').config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files from the 'frontend/public' directory
app.use(express.static(path.join(__dirname, '../frontend/public')));  // Adjusted path to the frontend folder

// Serve the index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));  // Adjusted path to the frontend folder
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

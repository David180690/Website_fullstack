// frontendServer.js
const express = require('express');
const path = require('path');
const app = express();

// Middleware to serve static files from the 'frontend/public' directory
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Serve the index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// Export the app so it can be used in server.js
module.exports = app;

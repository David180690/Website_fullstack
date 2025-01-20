// frontendServer.js
const express = require('express');
const path = require('path');
const router = express.Router(); // Use router instead of app

// Middleware to serve static files from the 'frontend/public' directory
router.use(express.static(path.join(__dirname, '../../frontend/public')));

// Serve the index.html for the root route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// Export the router
module.exports = router;

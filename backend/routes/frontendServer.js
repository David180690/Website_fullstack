const express = require('express');
const path = require('path');
const router = express.Router(); // Use router instead of app

// Middleware to serve static files from the 'backend/public' directory
router.use(express.static(path.join(__dirname, '/routes/public')));

// Serve the index.html for the root route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export the router
module.exports = router;

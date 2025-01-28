// server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const frontendServer = require('./routes/frontendServer'); // Import frontend server logic
const beerRoutes = require('./routes/beerRoute');  // Import the beer route file
const userRoutes = require('./routes/userRoute');  // Import the user route file
const app = express();
require('dotenv').config();  // Load .env variables

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/', frontendServer);  // Integrate frontend server routes
app.use(beerRoutes);  // Integrate beer routes
app.use(userRoutes);  // Integrate user routes

// Connect to MongoDB (single connection for both user and beer databases)
// Update the MongoDB URI to use the Docker service name (mongo) instead of localhost
mongoose.connect('mongodb://mongo:27017/beer_database', { // 'mongo' is the MongoDB service name
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('connected', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

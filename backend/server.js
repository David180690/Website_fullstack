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
const redis = require('redis');
require('dotenv').config();  // Load .env variables

// // Load environment variables
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

if (!MONGO_URI || !JWT_SECRET) {
    console.error('Missing environment variables! Check deployment configuration.');
    process.exit(1);
}

console.log(process.env.REDIS_HOST, process.env.MONGO_URI, process.env.JWT_SECRET);

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/', frontendServer);  // Integrate frontend server routes
app.use(beerRoutes);  // Integrate beer routes
app.use(userRoutes);  // Integrate user routes

// Connect to MongoDB (single connection for both user and beer databases)
// Update the MongoDB URI to use the Docker service name (mongo) instead of localhost
mongoose.connect(MONGO_URI, { // 'mongo' is the MongoDB service name
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('connected', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.error('MongoDB connection error:', err));



const redisClient = redis.createClient({
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
    },
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.error('Redis error:', err));

(async () => {
    try {
        await redisClient.connect(); // Ensure connection happens asynchronously
    } catch (err) {
        console.error('Error connecting to Redis:', err);
        process.exit(1); // Exit if Redis connection fails
    }
})();





// Start the server

app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

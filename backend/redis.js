const redis = require('redis');
require('dotenv').config();


// Redis Configuration
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Initialize Redis client
const redisClient = redis.createClient({
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
    },
});

// Redis Event Listeners
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

// Save a token in Redis with a TTL (time-to-live)
// token: the token to store
// ttl: time-to-live in seconds
// data: data to associate with the token

async function saveToken(token, ttl, data) {
    try {
        await redisClient.setEx(token, ttl, JSON.stringify(data));
    } catch (err) {
        console.error('Error saving token:', err);
    }
}

/**
 * Validate a token by checking Redis for its existence.
 * @param {string} token - The token to validate.
 * @returns {object|null} - The data associated with the token, or null if not found.
 */
async function validateToken(token) {
    try {
        const data = await redisClient.get(token);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error('Error validating token:', err);
        return null;
    }
}

/**
 * Delete a token from Redis.
 * @param {string} token - The token to delete.
 * @returns {boolean} - True if the token was deleted, false otherwise.
 */
async function deleteToken(token) {
    try {
        const result = await redisClient.del(token);
        return result > 0;
    } catch (err) {
        console.error('Error deleting token:', err);
        return false;
    }
}

module.exports = {
    redisClient,
    saveToken,
    validateToken,
    deleteToken,
};

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For token-based authentication
require('dotenv').config();
const frontendServer = require('./frontendServer'); // Import frontend server logic
const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());


app.use('/', frontendServer);  // Integrate frontend server routes


// Connect to MongoDB (single connection for both user and beer databases)
mongoose.connect('mongodb://localhost:27017/beer_database', {});
const db = mongoose.connection;

db.on('connected', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.error('MongoDB connection error:', err));

// Define schemas and models
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const beerSchema = new mongoose.Schema({
    name: String,
    type: String,
    alcoholContent: Number,
    origin: String,
    comment: String,
    image: String, // Image URL or base64 string
});

const User = mongoose.model('User', userSchema);
const Beer = mongoose.model('Beer', beerSchema);


// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from authorization header
    if (!token) return res.status(401).send({ message: 'Access denied. No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: 'Invalid token.' });
        req.user = user;
        next();
    });
};




// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare password with hashed password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Create and sign JWT token
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Validate token route
app.post('/api/validate-token', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from authorization header
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        res.status(200).json({ message: 'Token is valid', user: decoded });
    });
});

// Protected API route to fetch beers
app.get('/api/beers', authenticateToken, async (req, res) => {
    try {
        const beers = await Beer.find();
        res.status(200).json(beers);
    } catch (error) {
        console.error('Error fetching beers:', error);
        res.status(500).send({ message: 'Error fetching beers' });
    }
});

// Protected API route to add a beer
app.post('/api/beers', authenticateToken, async (req, res) => {
    try {
        const { name, type, alcoholContent, origin, comment, image } = req.body;
        const beer = new Beer({ name, type, alcoholContent, origin, comment, image });
        await beer.save();
        res.status(201).json({ message: 'Beer added', beer });
    } catch (error) {
        console.error('Error saving beer:', error);
        res.status(500).json({ message: 'Error saving beer' });
    }
});

// Protected API route to delete a beer
app.delete('/api/beers/:id', authenticateToken, async (req, res) => {
    try {
        const beerId = req.params.id;
        const beer = await Beer.findByIdAndDelete(beerId);

        if (!beer) return res.status(404).send({ message: 'Beer not found' });

        res.send({ message: 'Beer deleted successfully' });
    } catch (error) {
        console.error('Error deleting beer:', error);
        res.status(500).send({ message: 'Error deleting beer' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

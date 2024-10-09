const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Connect to MongoDB (no authentication)
const mongoUri = `mongodb://mongo:27017/${process.env.DB_NAME}`; // Use the default MongoDB database without username and password
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

// Define a schema and model for the profile
const profileSchema = new mongoose.Schema({
    name: String,
    email: String,
    interest: String,
});
const Profile = mongoose.model('Profile', profileSchema);

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route to handle profile submissions
app.post('/api/profile', async (req, res) => {
    try {
        const { name, email, interest } = req.body;

        // Create and save a new profile
        const newProfile = new Profile({ name, email, interest });
        await newProfile.save();

        res.status(200).json({ message: 'Profile saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving profile', error });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

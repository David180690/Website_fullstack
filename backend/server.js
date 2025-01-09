const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());


// Create a connection for the "beer" database
const beerDB = mongoose.createConnection(process.env.MONGO_URI_BEER);

beerDB.on('connected', () => console.log('Connected to beer database'));
beerDB.on('error', (err) => console.error('Error connecting to beer database:', err));

// Define schemas and models
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    level: String,
});


const beerSchema = new mongoose.Schema({
    name: String,
    type: String,
    alcoholContent: Number,
    origin: String,
    comment: String,
    image: String, // Image URL or base64 string
});
const Beer = beerDB.model('Beer', beerSchema); // Use the beerDB connection

// Middleware to serve static files from the 'frontend/public' directory
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Serve the index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});


// API route to save a new beer
app.post('/api/beers', async (req, res) => {
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

app.get('/api/beers', async (req, res) => {
    try {
        const beers = await Beer.find(); // Fetch all beers from the database
        res.status(200).json(beers); // Send the list of beers as the response
    } catch (error) {
        console.error('Error fetching beers:', error);
        res.status(500).json({ message: 'Error fetching beers' });
    }
});

app.delete("/api/beers/:id", async (req, res) => {
    try {
        const beerId = req.params.id;  // Get the beer ID from the URL parameters
        const beer = await Beer.findByIdAndDelete(beerId);  // Delete the beer from MongoDB

        if (!beer) {
            return res.status(404).send({ message: "Beer not found" });
        }

        res.send({ message: "Beer deleted successfully" });  // Respond with success message
    } catch (error) {
        console.error("Error deleting beer:", error);
        res.status(500).send({ message: "Error deleting beer" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

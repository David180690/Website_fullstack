// beerRoute.js
const express = require('express');

const mongoose = require('mongoose');
const router = express.Router();
const Beer = require('../models/beerModel'); // Import the Beer model
const authenticateToken = require('../middleware/authToken'); // Import the authenticateToken middleware

// Authentication Middleware


// Protected API route to fetch beers
router.get('/api/beers', authenticateToken, async (req, res) => {
    try {
        const beers = await Beer.find();
        res.status(200).json(beers);
    } catch (error) {
        console.error('Error fetching beers:', error);
        res.status(500).send({ message: 'Error fetching beers' });
    }
});

// Protected API route to add a beer
router.post('/api/beers', authenticateToken, async (req, res) => {
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
router.delete('/api/beers/:id', authenticateToken, async (req, res) => {
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

module.exports = router;

const mongoose = require('mongoose');

// Define the beer schema
const beerSchema = new mongoose.Schema({
    name: String,
    type: String,
    alcoholContent: Number,
    origin: String,
    comment: String,
    image: String, // Image URL or base64 string
});

// Create the Beer model
const Beer = mongoose.model('Beer', beerSchema);

module.exports = Beer;



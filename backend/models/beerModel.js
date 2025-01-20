const mongoose = require('mongoose');

// Define the Beer schema
const beerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    alcoholContent: { type: Number, required: true },
    origin: { type: String, required: true },
    comment: { type: String, required: true },
    image: { type: String }, // Optional field for beer image
    url: { type: String }, // Optional field for beer URL
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    username: { type: String, required: true } // Store the username of the user who added the beer
});

// Create the Beer model
const Beer = mongoose.model('Beer', beerSchema);

module.exports = Beer;

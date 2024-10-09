const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Define the MongoDB connection URL and credentials
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const authenticationDatabase = 'admin'; // Adjust if needed
const databaseName = 'WEBDEMO3'; // The database you want to connect to
const uri = `mongodb://${username}:${password}@localhost:27017/${databaseName}?authSource=${authenticationDatabase}`;

// Function to check the connection
async function checkConnection() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log(`Connected to MongoDB database: ${databaseName} successfully!`);

        // List current databases
        const databases = await client.db().admin().listDatabases();
        console.log('Current Databases:');
        databases.databases.forEach(db => console.log(`- ${db.name}`));
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit the process if unable to connect
    } finally {
        await client.close();
    }
}

// Define a schema and model for the profile
const profileSchema = {
    name: String,
    email: String,
    interest: String,
};

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route to handle profile submissions
app.post('/api/profile', async (req, res) => {
    const client = new MongoClient(uri);
    try {
        const { name, email, interest } = req.body;

        await client.connect();
        const db = client.db(databaseName);
        const profilesCollection = db.collection('profiles');

        // Create and save a new profile
        const newProfile = { name, email, interest };
        await profilesCollection.insertOne(newProfile);

        res.status(200).json({ message: 'Profile saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving profile', error });
    } finally {
        await client.close();
    }
});

// Start the server after checking the MongoDB connection
const PORT = process.env.PORT || 5000;
checkConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

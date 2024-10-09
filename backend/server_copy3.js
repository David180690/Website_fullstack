const { MongoClient } = require('mongodb');

// Define the MongoDB connection URL and credentials
const username = 'david';
const password = 'MasterYoda';
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
    } finally {
        await client.close();
    }
}

// Execute the connection check
checkConnection().catch(console.error);

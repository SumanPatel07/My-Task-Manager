const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file if available

// Set the MongoDB connection string based on the environment
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/TaskManager';

// Connect to MongoDB
mongoose.connect(dbURI, {
    useUnifiedTopology: true, 
})
.then(() => {
    console.log(`Connected to MongoDB successfully at ${dbURI}`);
})
.catch((e) => {
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
});

module.exports = mongoose;

const mongoose = require('mongoose');

require('dotenv').config(); // Load environment variables from .env file if available

// Set the MongoDB connection string based on the environment
//const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/TaskManager';

const dbSERVER = async () =>
    {
        try {
            mongoose.set('strictQuery',false)
            await mongoose.connect(process.env.MONGO_SERVER_URL, {
                useNewUrlParser: true,  // Prevents URL string parser deprecation warning
                useUnifiedTopology: true  // Prevents topology engine deprecation warning
            });
            console.log('Db server connection successful')
        }
        catch (error){
            console.log('db server connection error',error);        
        }
    }
// Connect to MongoDB
// mongoose.connect(dbURI, {
//     useUnifiedTopology: true, 
// })
// .then(() => {
//     console.log(`Connected to MongoDB successfully at ${dbURI}`);
// })
// .catch((e) => {
//     console.log("Error while attempting to connect to MongoDB");
//     console.log(e);
// });

module.exports = {dbSERVER};

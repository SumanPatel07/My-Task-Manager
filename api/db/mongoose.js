const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/TaskManager', {
    useUnifiedTopology: true, // Recommended for Mongoose 5.7+
    // The useNewUrlParser option is no longer needed in Mongoose 6.x
})
.then(() => {
    console.log("Connected to MongoDB successfully :)");
})
.catch((e) => {
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
});

// Export mongoose instance
module.exports = mongoose;

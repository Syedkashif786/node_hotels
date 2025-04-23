const mongoose = require('mongoose');

//define mongodb connection URL
const mongoURL = 'mongodb://127.0.0.1:27017/hotels' // replace hotels with diff database name

//set up mongoDb connection
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//get the default connection
// mongoose maintains a default connection object representing the MongoDB connection
const db = mongoose.connection;

//define event listeners for database connection
db.on('connected', ()=>{
    console.log("Connected to MongoDB Server");
});

db.on('error', (err)=>{
    console.error('MongoDB connection error: ', err);
});

db.on('disconnected', ()=>{
    console.log('MongoDB disconnected');
});

//export the database connection
module.exports = db;
const mongoose = require('mongoose');
require('dotenv').config();
//define mongodb connection URL
const mongoURL = process.env.MONGODB_URL_LOCAL // replace hotels with diff database name
// const mongoURL = process.env.MONGODB_URL
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
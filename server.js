const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000
const db = require('./db');
require('dotenv').config();
const passport = require('./auth');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Middleware functions
const logRequest = (req,res, next)=>{
    console.log(`[${new Date().toLocaleString()}] Request made to: ${req.originalUrl} `);
    next();
}
app.use(logRequest);

app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local', {session: false});

//home page
app.get('/', (req,res)=>{
    res.send("Welcome to our Hotel");
});

//import the router files
const personRoutes = require('./routes/personRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');


//use the routers
app.use('/person', localAuthMiddleware, personRoutes);
app.use('/menuItem', menuItemRoutes);

app.listen(PORT, (error)=>{
    if(!error)
        console.log(`Server running at PORT ${PORT}`);
    else
        console.log("Error occured, Server can't", error);
});

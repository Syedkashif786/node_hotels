const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.get('/', (req,res)=>{
    res.send("Welcome to our Hotel");
});




//import the router files
const personRoutes = require('./routes/personRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');

//use the routers
app.use('/person', personRoutes);
app.use('/menuItem', menuItemRoutes);

app.listen(PORT, (error)=>{
    if(!error)
        console.log(`Server running at PORT ${PORT}`);
    else
        console.log("Error occured, Server can't", error);
});

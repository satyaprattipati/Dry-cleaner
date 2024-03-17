// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');
app.set('view engine', 'pug');
app.set('views', './app/views');


app.get('/', function (req, res) {
    res.render('login');
});

app.get('/login', function (req, res) {
    res.send('hello');
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});
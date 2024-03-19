// Import express.js
const express = require("express");
const bodyParser = require('body-parser');

// Create express app
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());
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
app.get('/register', function (req, res) {
    res.render('register');
});

// Registration route
app.post('/register-page', async function (req, res) {
    console.log(req.body)
    const { username, email, password, fullname, dob, gender } = req.body;
    const sql = 'INSERT INTO Users (username, email, password, fullname, dob, gender) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [username, email, password, fullname, dob, gender];
    try {
        await db.query(sql, values);
        res.status(200).send('Registration successful');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});
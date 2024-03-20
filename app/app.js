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

app.post('/login', async function (req, res) {
    const { username, password } = req.body;
    try {
        const sql = 'SELECT * FROM Users WHERE username = ? AND password = ?';
        const [user] = await db.query(sql, [username, password]);
        if (user) {
            res.render('customer-dashboard')
            // res.send(`Welcome, ${username}!`);
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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

app.get("/dashboard", async function (req, res) {
    try {
        const sql1 = 'SELECT SUM(price) AS TotalpriceThisWeek FROM laundary WHERE WEEK(selected_date) = WEEK(CURDATE())';
        const sql2 = 'SELECT SUM(price) AS TotalpriceThisMonth FROM laundary WHERE YEAR(selected_date) = YEAR(CURDATE()) AND MONTH(selected_date) = MONTH(CURDATE())';
        const sql3 = 'SELECT SUM(price) AS TotalpriceThisYear FROM laundary WHERE YEAR(selected_date) = YEAR(CURDATE())';
        const sql4 = 'SELECT SUM(price) AS Totalprice FROM laundary';
        const sql5 = 'SELECT * FROM laundary WHERE user_id = 1';

        const [results1, results2, results3, results4, results5] = await Promise.all([
            db.query(sql1),
            db.query(sql2),
            db.query(sql3),
            db.query(sql4),
            db.query(sql5)
        ]);

        res.render("customer-dashboard", {
            'results': results5,
            'weekly': results1[0].TotalpriceThisWeek || 0,
            'monthly': results2[0].TotalpriceThisMonth || 0,
            'yearly' : results3[0].TotalpriceThisYear || 0,
            'total': results4[0].Totalprice || 0
        });
    } catch (error) {
        res.render("customer-dashboard");
    }
});


// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});
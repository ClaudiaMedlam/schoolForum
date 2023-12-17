// Imports the modules needed
var express = require ('express')
var session = require('express-session');
var flash = require('connect-flash');
var ejs = require('ejs')
var mysql = require('mysql');
const bodyParser = require('body-parser');


// Creates the express application object
const app = express()
const port = 8000
app.use(bodyParser.urlencoded({ extended: true }));

// Defines the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'appuser',
    password: 'app2027',
    database: 'schoolForum'
});

// Configure the express-session 
app.use(session({
    secret: 'Secret-Key',
    resave: true,
    saveUninitialized: true,
}));

// Use connect-flash middleware
app.use(flash());

// Connects to the database
db.connect((err) => {
    if(err) {
        console.error("Error connecting to database: " + err.message);
    }
    console.log('Connected to the schoolForum database');
})
global.db = db;

// Static Files - sets up css
app.use(express.static(__dirname + '/public'));

// Defines website metadata
var websiteData = {websiteName: "School Forum"}

// Sets the directory where Express will pick up html files
app.set('views', __dirname + '/views');

// Tells Express to use EJS as the templating engine
app.set('view engine', 'ejs');

// Tells Express to process html files using EJS's rendering engine
app.engine('html', ejs.renderFile);

// Requires the main.js file inside the routes folder passing in the Express app
// and data as arguments.  All the routes are found in this file
require('./routes/main')(app, websiteData);


// Starts the web app listening
app.listen(port, () => console.log(`schoolForum app listening on port ${port}!`))
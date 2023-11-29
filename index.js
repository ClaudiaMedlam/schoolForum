// Imports the modules needed
var express = require ('express')
var ejs = require('ejs')
var mysql = require('mysql');
// const bodyParser = require('body-parser');

// Creates the express application object
const app = express()
const port = 8000
// app.use(bodyParser.urlencoded({ extended: true }));

// Defines the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'appuser',
    password: 'app2027',
    database: 'schoolNet'
});

// Connects to the database
db.connect((err) => {
    if(err) {
        throw err;
        console.log("Error!", err.message);
    }
    console.log('Connected to the schoolNet database');
})
global.db = db;

// Static Files - sets up css
app.use(express.static(__dirname + '/public'));

// Defines website data
var websiteData = {websiteName: "School Net"}

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
app.listen(port, () => console.log(`SchoolNet app listening on port ${port}!`))
<strong>About project</strong><br />
This is a forum website, which is created for an hypothetical primary school for Dynamic Web Application assignment.<br />

I have used the node + express + ejs + mysql for back end, and css for front end.<br />

Minimum requirements met:
- System should allow posts by users on specific topics
- A home page with links to other pages
- A page to list existing topics
- A page to list existing users
- A page to list existing posts
- A page to add a new post
- An about page
- Posts should be associated with a single user and single topic
- Users should be members of topics before they can post

Extensions:
- Added stylesheet to make the app look nice (with more time I would have made it look nicer! This was bare minimum)
- Use Mysql views for database layer (see below for implementation)
- Use Mysql stored procedures for database layer (see below for implementation)
- Using GitHub

Intended Extensions:
- Allow a user to login/logout: <br /> I wasted an entire day trying to get a login-logout page to work but there was an issue with passport.authenticate that I just couldn't solve.<br /> I include the code for that below and would appreciate any feedback on what was going wrong!<br />
- Because of the above I didn't have time to implement replies to posts, which I was intending.

<strong>About deployment</strong><br />
<em>1. This project use Node.js + mysql as server, please ensure that you have installed them. It doesn't include the node modules so they have to be separately loaded, using npm install commande to install them.</em><br />

<em>2. The mysql database can be created with the information provided in the create_db.sql page, also outlined below:</em>

#Mysql command

#First create database:
CREATE DATABASE schoolForum;
USE schoolForum;

#Create the tables:
CREATE TABLE topics (topic_id INT AUTO_INCREMENT, topic_title VARCHAR(150), PRIMARY KEY(topic_id));<br />

CREATE TABLE users (user_id INT AUTO_INCREMENT, user_name VARCHAR(50), user_password VARCHAR(20), user_email VARCHAR(50), PRIMARY KEY(user_id));<br />

CREATE TABLE posts(<br />
    post_id INT AUTO_INCREMENT,<br />
    post_title MEDIUMTEXT,<br />
    post_content LONGTEXT,<br />
    post_date DATETIME DEFAULT CURRENT_TIMESTAMP,<br />
    user_id INT,<br />
    topic_id INT,<br />
    PRIMARY KEY (post_id),<br />
    FOREIGN KEY (user_id) REFERENCES users(user_id),<br />
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id)<br />
    );<br />

CREATE TABLE userTopic (<br />
    user_id INT,<br />
    topic_id INT,<br />
    PRIMARY KEY (user_id, topic_id),<br />
    FOREIGN KEY (user_id) REFERENCES users(user_id),<br />
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id)<br />
    );<br />

#Create app user and provide accesss to the database:<br />
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';<br />

GRANT ALL PRIVILEGES ON schoolForum.* TO 'appuser'@'localhost';<br />

<em>3. The mysql database can be filled with the information in insert_test_data.sql, also provided below:</em>

USE schoolForum;

INSERT INTO users (user_name, user_email, user_password) <br />
VALUES('Anna', 'anna@karenina.com', 'p4ssword'), <br />
('Bilbo', 'bilbo@baggins.com', 'passw0rd'), <br />
('Cruella','cruella@devil.com','pa55word'), <br />
('David', 'david@copperfield.com', 'password!'),<br />
('Emma', 'emma@bovary.com', 'Password'),<br />
('Llewelyn', 'Llewelyn.Fernandes@gold.ac.uk', 'DWApps') ;<br />

INSERT INTO topics (topic_title)<br />
VALUES ('Uniform'), ('Trips'), ('Lunch'), ('Assemblies'),<br />
('Reception Year'), ('Year 1'), ('Year 2'), ('Year 3'), ('Year 4'), ('Year 5'), ('Year 6'), <br />
('School Socials'), ('Projects');<br />

#Create view to consolidate code in routes /posts and /search-result
CREATE VIEW vw_posts AS
SELECT
    p.post_id,
    p.post_date,
    u.user_name,
    t.topic_title,
    p.post_title,
    p.post_content
FROM
    posts p
JOIN
    users u ON u.user_id = p.user_id
JOIN
    topics t ON t.topic_id = p.topic_id
ORDER BY
    post_date DESC;

#Create SQL stored procedure for /added-posts
DELIMITER //
CREATE PROCEDURE sp_insert_post(IN p_post_title MEDIUMTEXT, IN p_post_content LONGTEXT, IN p_topic_title VARCHAR(150), IN p_user_name VARCHAR(50))
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_topic_id INT;
    DECLARE v_user_is_member INT;
    
    SELECT user_id
    FROM users
    WHERE user_name=p_user_name
    INTO v_user_id;
    
    IF ISNULL(v_user_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No matching username found';
    END IF;
    
    SELECT topic_id
    FROM topics
    WHERE topic_title = p_topic_title
    INTO v_topic_id;
    
    IF ISNULL(v_topic_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No matching topic found';
    END IF;
    
    SELECT COUNT(*) AS countmembership
    FROM userTopic
    WHERE user_id = v_user_id AND topic_id = v_topic_id
    INTO v_user_is_member;
    
    IF v_user_is_member = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not a member of that topic';
    END IF;
    
    INSERT INTO posts (post_date, post_title, post_content, user_id, topic_id)
    VALUES (NOW(), p_post_title, p_post_content, v_user_id, v_topic_id);
END //
DELIMITER ;


<strong>About extras:</strong><br />
Login/logout code for index.js and main.js. It would not work! I spent a day trying to debug and rework but to no avail...

<em>1. The code for index.js with passport authentication:</em><br />
// Imports the modules needed
var express = require ('express')
var session = require('express-session');
var flash = require('connect-flash');
var ejs = require('ejs')
var mysql = require('mysql');
const bodyParser = require('body-parser');

// For login/logout authentication:
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

... code as per files above

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy setup
passport.use(new LocalStrategy(async (user_name, password, done) => {
    try {
        console.log("attempting log in with: " + user_name, password);

        // Check username and password in the database
        const result = await query('SELECT * FROM users WHERE user_name = ?', [user_name]);
        console.log("Database query result: " + result);

        if(result.length==0) {
            return done(null, false, {message: "Incorrect username"});
        }


        //Compare passwords with database
        if(password === users.user_password) {
            return done(null, user);
        } 
        else {
            return done(null, false, {message: "Incorrect password"});
        }
    }

    catch(err) {
        console.error(err);
        return done(err);
    }
}));


// Serialise and deserialise user (as per Brown (2020) p.243)
passport.serializeUser((user, done) => {
    done(null, users.user_id);

})

passport.deserializeUser((user_id, done) => {
    let sqlquery = `SELECT * FROM users WHERE user_id = ?`;
    
    db.query(sqlquery, [user_id], (err, result) => {
        if(err) throw err;
        let user = result[0];
        done(null, user);
    });
});

// Requires the main.js file inside the routes folder passing in the Express app
// and data as arguments.  All the routes are found in this file
require('./routes/main')(app, websiteData, passport);


// Starts the web app listening
app.listen(port, () => console.log(`SchoolNet app listening on port ${port}!`))


<em>2. The code for main.js (route handling) including passport authentication:</em><br />
module.exports = function(app, websiteData, passport) {
    
    // Protect user-required pages
    const isAuthenticated = (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }

        res.redirect('/login');
    }


    // Handles routes
... code as per files above

    // ************************************************************************
    // LOGIN PAGE 
    app.get('/login', function(req, res) {
        let newData = Object.assign(
            {},
            websiteData,
            {messages:req.flash('error')}
        )
        res.render('login.ejs', newData);

    })

    // app.post('/login', (req, res, next) => {
    //     passport.authenticate('local', {
    //         successRedirect: '/',
    //         failureRedirect: '/login',
    //         failureFlash: true
    //     }) (req, res, next);
    // });

    app.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error(err);
                return next(err);
            }
    
            if (!user) {
                req.flash('error', info.message); // Add this line to store the flash message
                return res.redirect('/login');
            }
    
            req.logIn(user, (err) => {
                if (err) {
                    console.error(err);
                    return next(err);
                }
                console.log("Authentication successful");
                return res.redirect('/');
            });
        })(req, res, next);
    });
    

    // LOGOUT PAGE
    app.get('/logout', function(req, res) {

        res.render('logout.ejs', websiteData);
    });



    // ************************************************************************
    // [EACH ROUTE THEN HAS...]
    app.get('/[route]', isAuthenticated, function(req, res){
        let newData = Object.assign({}, websiteData, {user: req.isAuthenticated() ? req.user : null})
        res.render('[route].ejs', newData)
    });


};

module.exports = function(app, websiteData) {
        
    // Handles routes
    // HOME PAGE
    app.get('/', function(req, res){
        res.render('index.ejs', websiteData)
    });

    // ABOUT PAGE
    app.get('/about', function(req, res){
        res.render('about.ejs', websiteData)
    });

    // TOPICS LIST PAGE
    app.get('/topics', function(req, res){
        // Queries database to get all the topics
        let sqlquery = "SELECT * FROM topics"

        // Executes sql query
        db.query(sqlquery, (err, result) => {
            // Redirects to home page in case of any database query error
            if (err) {
                res.redirect('./');
            }

            // Creates object combining websiteData and database topics
            let newData = Object.assign({}, websiteData, {availableTopics:result});
            console.log(newData.name);
            res.render('topics.ejs', newData);

        });
    });

    // USER LIST PAGE
    app.get('/users', function(req, res){
        // Queries database to get all the users
        let sqlquery = "SELECT * FROM users"

        // Executes sql query
        db.query(sqlquery, (err, result) => {
            // Redirects to home page in case of any database query error
            if (err) {
                res.redirect('./');
            }

            // Creates object combining websiteData and database topics
            let newData = Object.assign({}, websiteData, {allUsers:result});
            console.log(newData.name);
            res.render('users.ejs', newData);

        });
    });

    // POSTS
    // POSTS LIST PAGE
    app.get('/posts', function(req, res){
        // Queries database to get all the users
        let sqlquery = "SELECT title, content, datePosted, topic_id FROM posts";


        // Executes sql query
        db.query(sqlquery, (err, result) => {
            // Redirects to home page in case of any database query error
            if (err) {
                res.redirect('./');
            }

            // Creates object combining websiteData and database topics
            let newData = Object.assign({}, websiteData, {allPosts:result});
            res.render('posts.ejs', newData);

        });
    });

    // ADD NEW POST PAGE
    app.get('/addposts', function(req, res) {
        res.render('addposts.ejs', websiteData)
    });

    app.post('/added-post', function(req, res) {
        // Saves data to database
        let sqlquery = `INSERT INTO posts (title, content, user_id, topic_id, datePosted) 
                        VALUES (?,?,?,?,?)`; 

        // Prepares the data for query
        let newrecord = [req.body.title, req.body.content, req.body.user_id, req.body.topic_id, req.body.datePosted];
        // Executes sql query
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            
            // Confirmation message
            else {
                res.send("This post has been added to database: title: " + 
                req.body.title + ",   content: " + req.body.content);

            }

        });

    });

    // SEARCH POSTS
    app.get('/search', function(req, res){
        res.render('search.ejs', websiteData)
    });

    // Search results page : research into how to incorporate it into client-side html / apply client-side css
    app.get('/search-result', function(req, res) {

        res.send("You searched for a post with the keyword: " + req.query.keyword);

    });
}
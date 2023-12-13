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
            res.render('users.ejs', newData);

        });
    });

    // POSTS
    // POSTS LIST PAGE
    app.get('/posts', function(req, res){
        // Queries database to get all the users
        let sqlquery = `SELECT post_id, post_date, user_name, topic_title, post_title, post_content
                        FROM vw_posts`;


        // Executes sql query
        db.query(sqlquery, (err, result) => {
            // Redirects to home page in case of any database query error
            if (err) {
                res.redirect('./');
            }

            // Format date function
            function formatDate(date) {
                return new Date(date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: '2-digit'
                });
            }
            // Format the date in the result
            const formattedResult = result.map(post => {
            return { ...post, post_date: formatDate(post.post_date) };
            });

            // Creates object combining websiteData and database topics
            let newData = Object.assign({}, websiteData, {allPosts:formattedResult});
            res.render('posts.ejs', newData);

        });
    });

    // ADD NEW POST PAGE
    app.get('/addposts', function(req, res) {
        // Queries database to get all the users
        let sqlquery = "SELECT * FROM topics"

        // Executes sql query
        db.query(sqlquery, (err, result) => {
            // Redirects to home page in case of any database query error
            if (err) {
                res.redirect('./');
            }

            // Creates object combining websiteData and database topics
        // Creates object combining websiteData and database topics
        let newData = Object.assign({}, websiteData, {availableTopics:result});
        res.render('addposts.ejs', newData)
        });
    
    });

    app.post('/added-post', function(req, res) {
        let user_id = -1;
        let topic_id = -1;

        // Log the received form data
        console.log("Received form data:", req.body);

        // Get user id from the user name:
        let sqlquery = `SELECT * FROM users WHERE user_name = ?`
        db.query(sqlquery, [req.body.user_name], (err, result) => {
            if(err) {
                return console.error(err.message);
            }

            if (result.length==0) {
                console.log("User is not found")

            }

            user_id = result[0].user_id;
            console.log("User is " + user_id);

            // Get the topic id from the topic title
            sqlquery = `SELECT * FROM topics WHERE topic_title = ?`
            db.query(sqlquery, [req.body.topic_title], (err, result) => {
                if(err) {
                    return console.error(err.message);
                }

                topic_id = result[0].topic_id;
                console.log("Topic is " + topic_id);
                
                // Insert the post, save data to database
                sqlquery = `INSERT INTO posts (post_date, post_title, post_content, user_id, topic_id)
                            VALUES (now(), ?, ?, ?, ? )`

                // Prepares the data for query
                let newrecord = [req.body.post_title, req.body.post_content, user_id, topic_id];

                // Executes sql query
                db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
            
                // Confirmation message
                else {
                    res.send("Your post has been added to the forum");

                }
                })
            })

        });
    });

    // SEARCH POSTS
    app.get('/search', function(req, res){
        res.render('search.ejs', websiteData)
    });


    // Search results return posts that contain the keyword entered in /search
    app.get('/search-result', function (req, res) { 
        // Searching the database
        let sqlquery = "SELECT post_title, post_content, user_id FROM posts WHERE post_title LIKE ?";
       
        // Execute sql query with wildcards to perform a case-insensitive partial match
        let searchRecord = ['%' + req.query.keyword + '%'];
        db.query(sqlquery, searchRecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }

        // Create object combining shopData and search result
        let newData = Object.assign({}, websiteData, {foundPosts:result});
        res.render('search-result.ejs', newData)
        });

    });
}
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


    // Search results return posts that contain the keyword entered in /search
    app.get('/search-result', function (req, res) { 
        // Searching the database
        let sqlquery = "SELECT title, content, user_id FROM posts WHERE title LIKE ?";
       
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
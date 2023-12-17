module.exports = function(app, websiteData) {
    
    // Handles routes
    // ************************************************************************
    // HOME PAGE
    app.get('/', (req, res) => {
        
        // Include user information if available:
        var secureData = {
            // Includes all properties from websiteData
            ...websiteData,
            user: req.user,
            message: "Incorrect input"

        };

        // Queries database to get all the topics
        let sqlquery1 = "SELECT topic_title FROM topics";
        let sqlquery2 = "SELECT post_title, post_content FROM posts"; 
        let sqlquery3 = "SELECT user_name FROM users";

        // Use Promise.all to execute all queries concurrently
        Promise.all([
            queryPromise(sqlquery1),
            queryPromise(sqlquery2),
            queryPromise(sqlquery3)
        ]).then(([result1, result2, result3]) => {
            // Creates object combining website & authentication data and database topics
            let newData = Object.assign({}, secureData, {availableTopics:result1, availablePosts:result2, availableUsers:result3});
            res.render('index.ejs', newData);
        }).catch(err => {
            console.error(err);
            res.redirect('./');
        })
    });

    // A helper function to promisify the database queries
    function queryPromise(sql) {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    
    // ************************************************************************
    // ABOUT PAGE
    app.get('/about', (req, res) => {
        let newData = Object.assign({}, websiteData);
        res.render('about.ejs', newData)
    });



    // ************************************************************************
    // TOPICS LIST PAGE
    app.get('/topics', (req, res) => {
        // Queries database to get all the topics in alphabetical order
        let sqlquery = "SELECT * FROM topics ORDER BY topic_title"

        // Executes sql query
        db.query(sqlquery, (err, result) => {
            // Redirects to home page in case of any database query error
            if (err) {
                res.redirect('./');
            }

            // Creates object combining website & authentication data and database topics
            let newData = Object.assign(
                {}, 
                websiteData, 
                {availableTopics:result});
            res.render('topics.ejs', newData);

        });
    });

    // ************************************************************************
    // USER LIST PAGE
    app.get('/users', (req, res) =>{
        // Queries database to get all the users
        let sqlquery = "SELECT * FROM users"

        // Executes sql query
        db.query(sqlquery, (err, result) => {
            // Redirects to home page in case of any database query error
            if (err) {
                res.redirect('./');
            }

            // Creates object combining website & authentication data and database topics
            let newData = Object.assign({}, 
                websiteData, 
                {allUsers:result});
            res.render('users.ejs', newData);

        });
    });

    // ************************************************************************
    // POSTS
    // POSTS LIST PAGE
    app.get('/posts', (req, res) => {
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

            // Creates object combining website & authentication data and database topics
            let newData = Object.assign(
                {}, 
                websiteData, 
                {allPosts:formattedResult});
            res.render('posts.ejs', newData);

        });
    });

    // ADD NEW POST PAGE
    app.get('/addposts', (req, res) => {
        // Queries database to get all the users
        let sqlquery = "SELECT * FROM topics"

        // Executes sql query
        db.query(sqlquery, (err, result) => {
            // Redirects to home page in case of any database query error
            if (err) {
                res.redirect('./');
            }

            // Creates object combining website & authentication data and database topics
        // Creates object combining website & authentication data and database topics
        let newData = Object.assign(
            {}, 
            websiteData, 
            {availableTopics:result});
        res.render('addposts.ejs', newData)
        });
    
    });

    app.post('/added-post', (req, res) => {
        // Using SQL Stored Procedure
        let params = [req.body.post_title, req.body.post_content, req.body.topic_title, req.body.user_name];
        let sqlquery = `CALL sp_add_post(?, ?, ?, ?)`;
    
        console.log("Parameters are: " + params);
    
        // Execute the SQL query
        db.query(sqlquery, params, (err, result) => {
            if (err) {
                // If there is an error, render the addposts.ejs page with an error message
                let newData = Object.assign({}, websiteData, req.body, { errormessage: "The post has not been added" });
                res.render("addposts.ejs", newData);
            } else if (result.length === 0) {
                // If the result is empty, render the addposts.ejs page with an appropriate message
                let newData = Object.assign({}, websiteData, req.body, { errormessage: "Please ensure all sections are filled in correctly" });
                res.render("addposts.ejs", newData);
            } else {
                // If everything is successful, send a success message
                res.send("Your post has been added to the forum");
            }
        });
    });

    // ************************************************************************
    // SEARCH POSTS
    app.get('/search', (req, res) => {
        let newData = Object.assign({}, websiteData)
        res.render('search.ejs', newData)
    });


    // Search results return posts that contain the keyword entered in /search
    app.get('/search-result', (req, res) => { 
       // Searching the database
        let sqlquery = `SELECT post_id, post_date, user_name, topic_title, post_title, post_content
                        FROM vw_posts
                        WHERE post_title LIKE ? OR post_content LIKE ?`;


        // Execute sql query with wildcards to perform a case-insensitive partial match
        let searchRecord = ['%' + req.query.keyword + '%', '%' + req.query.keyword + '%'];
        db.query(sqlquery, searchRecord, (err, result) => {
            if (err) {
                console.error(err.message);
                return res.redirect('./');
            }

            if(result.length==0) {
                return res.status(500).send("There are no posts containing that search term"); 
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

            // Creates object combining website & authentication data and database topics
            let newData = Object.assign(
                {}, 
                websiteData, 
                {foundPosts:formattedResult});
            res.render('search-result.ejs', newData);

         });
    });
};
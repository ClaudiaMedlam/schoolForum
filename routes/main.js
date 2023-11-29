module.exports = function(app, websiteData) {
        
    // Handles routes
    // HOME PAGE
    app.get('/', function(req, res){
        res.render('index.html', websiteData)
    });

    // ABOUT PAGE
    app.get('/about', function(req, res){
        res.render('about.html', websiteData)
    });

    // TOPICS LIST PAGE
    app.get('/topics', function(req, res){
        res.render('topics.html', websiteData)
    });

    // USER LIST PAGE
    app.get('/users', function(req, res){
        res.render('users.html', websiteData)
    });

    // POSTS
    // POSTS LIST PAGE
    app.get('/posts', function(req, res){
        res.render('posts.html', websiteData)
    });

    // ADD POSTS LIST PAGE
    app.get('/posts', function(req, res){
        res.render('posts.html', websiteData)
    });

    // ADD NEW POST PAGE
    app.get('/addposts', function(req, res) {
        res.render('addposts.html', websiteData)
    });

    app.get('/added-post', function(req, res) {
        
        res.send("You created the post titled: " + req.query.title);

    });

    // SEARCH POSTS
    app.get('/search', function(req, res){
        res.render('search.html', websiteData)
    });

    // Search results page : research into how to incorporate it into client-side html / apply client-side css
    app.get('/search-result', function(req, res) {

        res.send("You searched for a post with the keyword: " + req.query.keyword);

    });
}
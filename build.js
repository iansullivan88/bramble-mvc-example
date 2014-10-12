// Enable debugging
process.env.DEBUG = 'bramble';

var bramble = require('bramble-mvc'),
    path = require('path'),
    ncp = require('ncp').ncp,
    viewPath = path.join(__dirname, "lib", "view"),
    outputDirectory = path.join(__dirname, "output"),
    contentDirectory = path.join(__dirname, "assets"),
    blogRepository = require('./lib/data/blog-repository'),
    pageSize = 5;


bramble.get('/blog/page/:pageNumber', {defaults:{pageNumber: 1}}, function(req, res) {
    var pageNumber = parseInt(req.parameters.pageNumber, 10);
    res.view("blogpage", {
        posts: blogRepository.getPosts(pageNumber, pageSize),
        pageNumber: pageNumber,
        hasNewerPage: pageNumber > 1,
        hasOlderPage: blogRepository.hasOlderPage(pageNumber, pageSize),
        numberOfPosts: blogRepository.getTotalPosts(),
        showIntro: pageNumber == 1,
        showPageControls: true
    });
});

bramble.get('/blog/author/:name', function(req, res) {
    res.view("blogpage", {
        posts: blogRepository.getPostsByAuthor(req.parameters.name)
    });
});

bramble.get('/blog/post/:postName', function(req, res) {
    res.view("post", {
        post: blogRepository.getPost(req.postName)
    });
});

bramble.get('/more-info', function(req, res) {
    res.view("moreinfo");
});

bramble.redirect('/', '/blog/page');

bramble.build(viewPath, outputDirectory, brambleBuildComplete);

function brambleBuildComplete(err) {
    if (err) {
        console.log(err.stack);
    } else {
        // Copy static assets as well
        ncp(contentDirectory, outputDirectory, function (ncpErr) {
            if (err) {
                return console.error(ncpErr);
            } else {
                console.log("Built Site Successfully");
            }
        });
    }
}
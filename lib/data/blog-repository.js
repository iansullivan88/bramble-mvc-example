var fs = require('fs'),
	fm = require('front-matter'),
	path = require('path'),
    marked = require("marked"),
	postPath = path.join(__dirname, "../posts"),
    moment = require('moment'),
    posts = [];

fs.readdirSync(postPath).forEach(function(fileName) {
   var fileContent = fs.readFileSync(path.join(postPath, fileName), "utf8"),
       yaml = fm(fileContent),
       published = Date.parse(yaml.attributes.published);
   
    posts.push({
        title: yaml.attributes.title,
        author: yaml.attributes.author,
        preview: yaml.attributes.preview,
        publishedISO8601: yaml.attributes.published,
        publishedFormatted: moment(published).format("Do MMM YY"),
        published: published,
        uniqueName: getUrlFromFileName(fileName),
        content: marked(yaml.body),

   });
});

posts.sort(function(a, b) {
    return b.published - a.published;
});

exports.getPost = function(uniqueName) {
    return posts.filter(function(post) {
        return post.uniqueName == uniqueName;
    })[0];
};

exports.getPosts = function(page, pageSize) {
    var start = (page-1) * pageSize;
    return posts.slice(start, start + pageSize);
};

exports.hasOlderPage = function(page, pageSize) {
    var start = (page-1) * pageSize;
    return (start + pageSize) < posts.length;
}

exports.getPostsByAuthor = function(author) {
    return posts.filter(function(post) {
        return author == post.author;   
    });
};

exports.getTotalPosts = function() {
    return posts.length;
};

function getUrlFromFileName(fileName) {
    return fileName.split('.')[0]
        .replace(/[\(\)]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .toLowerCase();
}

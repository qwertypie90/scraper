// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var ObjectID = require('mongodb').ObjectID;
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();
var port = process.env.PORT || 3000;

// Use the express.static middleware to serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get('/', function(req, res) {
    res.render('index');
});

// Database configuration
var databaseUrl = "scraper";
var collections = ["articles"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});

// Requiring Note and Article models
var Comment = require("./models/comment.js");
var Article = require("./models/article.js");

var uri = 'mongodb://heroku_frgw9d9f:p3h11sk9b0onmjnnjrva5gto5n@ds245357.mlab.com:45357/heroku_frgw9d9f';

mongoose.Promise = global.Promise

mongoose.connect(uri);

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_frgw9d9f:p3h11sk9b0onmjnnjrva5gto5n@ds245357.mlab.com:45357/heroku_frgw9d9f");
//mongoose.connect("mongodb://localhost/mongoscraper");
var db2 = mongoose.connection;

// Show any mongoose errors
db2.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db2.once("open", function() {
    console.log("Mongoose connection successful.");
});


// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Make a request for the news section of ycombinator

    // Making a request for nhl.com's homepage
    request("https://www.nhl.com/", function(error, response, html) {

        // Load the body of the HTML into cheerio
        var $ = cheerio.load(html);

        // Empty array to save our scraped data
        var results = [];

        // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
        $("h4.headline-link").each(function(i, element) {

            // Save the text of the h4-tag as "title"
            var title = $(element).text();
            // Find the h4 tag's parent a-tag, and save it's href value as "link"
            var link = $(element).parent().attr("href");
                // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the scrapedData db
        db.articles.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});


// Retrieve data from the db
app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.articles.find({}, function(error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }
    });
});

// Retrieve data from the db that's been saved
app.get("/saved", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.articles.find({}, function(error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            console.log(found)
            res.json(found);
        }
    });
});

var commID;
var artID;

// Create a Comment
app.post("/comments/save/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    var newComment = new Comment({
        body: req.body.text,
        article: req.params.id
    });
    // console.log("hey", req.body)
    // And save the new note the db
    newComment.save(function(error, comment) {
        // Log any errors
        console.log(comment)
        if (error) {
            console.log(error);
        }
        // Otherwise
        else {

            db.articles.update({ "_id": mongoose.Types.ObjectId(req.params.id.toString()) }, { $push: { 'comments': newComment } }, function(err, doc) {
                // db.articles.update({ "_id": mongoose.Types.ObjectId(req.params.id.toString()) }, { $push: {'comments': newComment}}, function(err, doc) {
                console.log(doc)
                // Log any errors
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    // Or send the note to the browser
                    res.send(newComment);
                    // console.log(req)
                    // commID = comment.id
                    artID = comment.article
                    commID = comment._id
                    console.log(artID)
                    console.log(commID)

                }
            });

        }
    });
});

// Update a comment

app.put("/update/:id", function(req, res) {

    var newComment = new Comment({
        body: req.body.text,
        article: req.params.id
    });

    db.articles.update({ "_id": mongoose.Types.ObjectId(req.params.id.toString()) }, { $set: { 'comments': newComment } }, function(err, doc) {


    })
})



// Delete a note
app.delete("/comments/delete/:comment_id/:article_id", function(req, res) {

    artID = req.params.article_id
    // Use the note id to find and delete it
    db.articles.update({ "_id": ObjectID(artID) }, { $unset: { "comments": 1 } }, { multi: true })

});

app.listen(port, function() {
    console.log("Listening on PORT " + port);
});
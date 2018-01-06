// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
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
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
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

            // Make an object with data we scraped for this h4 and push it to the results array
            results.push({
                title: title,
                link: link
            });
        });

        // After looping through each h4.headline-link, log the results
        // console.log(results);
    });

    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.scrapedData.find({}, function(error, found) {
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

app.listen(port, function() {
    console.log("Listening on PORT " + port);
});
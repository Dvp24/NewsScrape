var express = require("express");
// var expressHanlebars = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan"); //why do we used morgan???
var mongoose = require("mongoose");
var db = require("./models");

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/newsScrape", { useNewUrlParser: true });

// how do we create models when using mongoose ????manually
// we dont need route files anymore?? not even when we are using handlebars with mongoose???

const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

// Routes===============================
// A GET route for scraping the nytimes website
app.get("/scrape", function(req, res){
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/section/world/americas?action=click&contentCollection=world&region=navbar&module=collectionsnav&pagetype=sectionfront&pgtype=sectionfront").then(function(response){
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    let $ =cheerio.load(response.data);
    // console.log(response.data);

    // now we grab every li within an o tag, and do the following:
    $("ol li").each(function(i, element){
      // save an empty result object
      var result = {};
      // console.log(element)

      // add the text and heading of every item, and save them as properties of the result object
      result.title = $(element)
      .find("h2")
      .text();
      result.para = $(element)
      .find("p")
      .text();
      result.author = $(element)
      .find(".css-1n7hynb")
      .text();
      console.log(result)

    // creating a new article using the result obj buit by scraping
      db.Article.create(result)
        .then(function(dbArticle){
          // console.log
          console.log(dbArticle)
        })
        .catch(function(err){
          console.log(err)
        })
      })
  })
  res.json(true);
})

// Route for getting all Articles from the db
app.get("/api/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// route to save the specific article
app.put("/save/:id", function(req, res){
  db.Article.findByIdAndUpdate(req.params.id, {$set: {isSaved: true}}, {new: true})
    .then(function(savedArticle){
    console.log(savedArticle);
    res.json(savedArticle);
    })
    .catch(function(err){
      console.log(err)
      res.json(err);
    })
})

// route for getting all saved articles
app.get("/api/saved-articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Saved.find({})
    .then(function(dbsaved) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbsaved);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});
app.get("/", function(req,res){
  db.Article.drop()
})


// starting our Express app===================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

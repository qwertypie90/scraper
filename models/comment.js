// Require Mongoose
var mongoose = require('mongoose');

// Create a Schema Class
var Schema = mongoose.Schema;

// Create Comment Schema
var CommentSchema = new Schema({

  // Comment Content
  body: {
    type: String
  },
    // Comment Content
  article: {
    type: String
  }
  
});


// Create the Comment model with Mongoose
var Comment = mongoose.model('Comment', CommentSchema);

// Export the Model
module.exports = Comment;
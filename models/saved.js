var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var SavedSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `para` is required and of type String

  para: {
    type: String,
    required: true
  },
  author:{
    type:String,
  },
  comments:{
    type:Array,
    body:String,
    name:String
  }
})
// This creates our model from the above schema, using mongoose's model method
var Saved = mongoose.model("saved", SavedSchema);

// Export the saved model
module.exports = Saved;

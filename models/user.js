var mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost/redditAuth"); 

mongoose.set("debug", true);

module.exports.Post = require("./post"); 

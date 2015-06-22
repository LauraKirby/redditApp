var mongoose = require("mongoose"); 
//mongoose.connect("mongodb://localhost/testing"); 
mongoose.connect("mongodb://localhost/redditAuth");

mongoose.set("debug", true);

module.exports.Post = require("./post"); 
module.exports.Comment = require("./comment");
module.exports.User = require("./user");
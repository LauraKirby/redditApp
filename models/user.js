var mongoose = require("mongoose"); 
var Post = require("./post"); 
var Comment = require("./comment"); 

var userSchema = new mongoose.Schema({
	firstName: String, 
	lastName: String, 
	email: String, 
	avatarUrl: String,
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	},
	comments: []
});

//deleting a user will delete all of their posts and comments 
//-- TO DO -- have not tested code below
// userSchema.pre('remove', function(nex){
// 	Post.remove({user: this._id}).exec(); 
// 	Comment.remove({user: this._id}).exec(); 
// 	next(); 
// }); 

var User = mongoose.model("User", userSchema); 
module.exports = User; 
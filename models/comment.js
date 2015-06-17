var mongoose = require("mongoose"); 

var commentSchema = new mongoose.Schema({
	//we could just pull in some of the user data here, instead of the entire object
	user: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "User"
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	},
	date: Number
});

var Comment = mongoose.model("Comment", commentSchema); 
module.exports = Comment; 
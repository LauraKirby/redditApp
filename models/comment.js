var mongoose = require("mongoose"); 

var commentSchema = new mongoose.Schema({
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
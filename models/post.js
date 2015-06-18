var mongoose = require("mongoose"); 
var Comment = require("./comment"); 

var postSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "User"
	},
	title: String, 
	content: String, 
	imageUrl: String,
	date: String,
	//comments: 
	// comments:[{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "Comment"
	// }]  
});

postSchema.pre('remove', function(next){
	Comment.remove({post: this._id}).exec(); 
	next(); 
}); 

var Post = mongoose.model("Post", postSchema); 
module.exports = Post; 
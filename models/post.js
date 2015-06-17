var mongoose = require("mongoose"); 
var Comment = require("./comment"); 

var postSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "User"
	},
	postTitle: String, 
	content: String, 
	imageUrl: String,
	comments: [],  
})

postSchema.pre('remove', function(nex){
	Comment.remove({post: this._id}).exec(); 
	next(); 
}); 

var Post = mongoose.model("Post", postSchema); 
module.exports = Post; 
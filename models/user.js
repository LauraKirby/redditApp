var mongoose = require("mongoose"); 
var Post = require("./post"); 
var Comment = require("./comment"); 
var bcrypt = require("bcrypt"); 
var SALT_WORK_FACTOR = 10;


var userSchema = new mongoose.Schema({
	firstName: { 
		type: String, 
		lowercase: true, 
		required: true
	}, 
	lastName: String, 
	email: {
		type: String, 
		required: true, 
	}, 
	avatarUrl: String,
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	},
	password: String, 
});

userSchema.pre('save', function(next){
	var user = this; 
	if (!user.isModified('password')){
		return next(); 
	}

	return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) {
			return next(err)
		}
		return bcrypt.hash(user.password, salt, function(err, hash){
			if(err) {
				return next(err); 
			}
			user.password = hash; 
			return next(); 
		});
	});
}); //closes userSchema function

//Create a Class Function
//don't call formData "user" bc we already have a different user defined
//statics === class methods
userSchema.statics.authenticate = function(formData, callback){
	//'this' refers to the model
	this.findOne({
		name: formData.name
	}, 
	function(err, user){
		if(user = null){
			callback("Invalid username or password")
		}
		else {
			user.checkPassword(formData.password, callback); 
			}
		});
  };

//Create a Class Function
userSchema.methods.checkPassword = function(password, callback){
	var user = this; 
	bcrypt.compare(password, user.password, function(err, isMatch){
		if(isMatch){
			callback(null, user); 
		} else {
			callback(err, null); 
		}
	});
};


var User = mongoose.model("User", userSchema); 
module.exports = User; 
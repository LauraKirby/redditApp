var db = require("../models"); 

var routeHelpers = {
	ensureLoggedIn: function(req, res, next) {
		if(req.session.id !== null && req.session.id !== undefined){
			return next(); 
		}
		else {
			res.render('users/login', {errorMessage: "you must be logged in to write a post"});
			//res.redirect('/posts'); 
		}
	}, 

	ensureCorrectUser: function(req, res, next) {
		db.User.findById(req.params.id, function(err, user) {
			if(user.ownerId !== req.session.id) {
				//res.render('posts/index', {errorMessage: "you must be logged in to write a post"});
				res.redirect('/posts'); 
			}
			else {
				return next(); 
			}
		});
	},

	preventLoginSignup: function(req, res, next){
		if(req.session.id !== null && req.session.id !== undefined){
			res.redirect('/posts'); 
		}
		else {
			return next(); 
		}
	}
};

module.exports = routeHelpers; 


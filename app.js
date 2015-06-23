var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"), 
	methodOverride = require("method-override"), 
	db = require("./models"),
	session = require("cookie-session"), 
	//could we export the middleware in our index.js file? 
	loginMiddleware = require("./middleware/loginHelper"), 
	routeMiddleware = require("./middleware/routeHelper"), 
	morgan = require("morgan");

app.use(morgan('tiny'));
app.set('view engine', 'ejs'); 
app.use(methodOverride('_method')); 
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(loginMiddleware);

app.use(session({
	maxAge: 360000, 
	secret: 'whoknows',
	name: "tcho chocolate"
}));

app.use(loginMiddleware); 

//------------ POST ROUTES ----------------//
//ROOT
//is the redirect causing the message to appear everytime bc the user is undefined?
//can i make the route route a render instead of redirect?
app.get('/', routeMiddleware.ensureLoggedIn, function(req, res){ 
	console.log("redirected back to posts")
	res.redirect("/posts");
});

//INDEX
app.get('/posts', function(req, res){
	db.Post.find({}, 
		function(err, posts){
			if (err){
				console.log("error from /posts/index" + err)
			} else {
				res.render('posts/index', {posts:posts, errorMessage: undefined}); 
			}
	});	
});

//SIGNUP - render form
app.get('/users/signup', routeMiddleware.preventLoginSignup, function(req, res){
	res.render('users/signup'); 
});

//SIGNUP - POST data from signup form to database
app.post("/signup", function(req, res){
	var newUser = req.body.user; 
	db.User.create(newUser, function(err, user){
		if(user){
			req.login(user); 
			res.redirect("/posts"); 
		} else {
			console.log("signup post error" + err); 
			//TODO handle errors in ejs
			res.render("users/signup")
		}
	});
});

//LOGIN - render login form
app.get("/users/login", routeMiddleware.preventLoginSignup, function(req, res){
	res.render("users/login"); 
});

//LOGIN - post login data from form to database
app.post("/login", function(req, res){
	//console.log(db.User);
	db.User.authenticate(req.body.user, 
		function(err, user){
			console.log("this is a user" + user)
			if(!err && user !== null){
				req.login(user); 
				res.redirect("/posts"); 
			} else {
				//TODO handle errors in ejs
				res.render("users/login"); 
			}
	});
});

//NEW
//require login for user to create a new post, add route middleware
app.get('/posts/new', routeMiddleware.ensureLoggedIn, function(req, res){
	console.log('entered posts/new')
	db.User.find({}, function(err, users){
		if(err){
			console.log("posts/new error " + err); 
		} else {
			res.render("posts/new"); 
		}
	})
});

//CREATE
app.post('/posts', function(req, res){
	db.Post.create({title: req.body.title, content: req.body.content, date: req.body.date}, 
		function(err, post) {
			if(err){
				console.log(err); 
				res.render("posts/index", {errorMessage: "you must be logged in to write a post"}); 
			}
			else {
				console.log(post); 
				res.redirect("/posts"); 
			}
		});
});

//SHOW
app.get('/posts/:id', function(req, res){
	db.Post.findById(req.params.id, 
		function(err, post) {
			db.Comment.find(
			{
				_id:{$in: post.comments}
			}, 
			function(err, comments){
				//add forEach to index.ejs for POST 
				res.render("posts/show", {post:post, comments:comments});
			});
		});
	//console.log(db.Post.findById(req.params.id)); 
});

//EDIT
app.get('/posts/:id/edit', function(req, res){
	db.Post.findById(req.params.id, 
		function(err, post){
			res.render("posts/edit", {post:post}); 
		})
});

//UPDATE
app.put('/posts/:id', function(req, res){
	db.Post.findByIdAndUpdate(req.params.id, {
		title: req.body.title, 
		content: req.body.content, 
		date: req.body.date 
	},
		function(err, post) {
			if(err) {
				res.render("posts/edit"); 
			}
			else {
				res.redirect("/posts"); 
			}
		});
});

//DESTROY
app.delete('/posts/:id', function(req, res){
	db.Post.findById(req.params.id, 
		function(err, post){
			if(err) {
				console.log(err); 
				res.render("posts/show"); 
			}
			else {
				post.remove(); 
				res.redirect("/posts"); 
			}
		});
});

//-------------- Comment Routes -----------------------//

//INDEX - list post and all comments 
app.get('/posts/:post_id/comments', function(req, res){
	//.populate('comments') - we did this my hand with post.comments
	//here doing two reads 
	//instead of two writes and one read
	db.Post.findById(req.params.post_id).exec(function(err,post){
		if (err) throw err
		db.Comment.find({post: req.params.post_id}, function(err, comments){
			if (err) throw err
			post.comments = comments;
			res.render("comments/index", {post:post});
		});
	});
});

//NEW 
app.get('/posts/:post_id/comments/new', function(req, res){
	db.Post.findById(req.params.post_id,
		function(err, post) {
			res.render("comments/new", {post:post})
		});
});

//CREATE
app.post('/posts/:post_id/comments', function(req,res){
	db.Comment.create({post:req.params.post_id, content: req.body.content, date: req.body.date}, function(err, comments){
		if(err){
			console.log(err); 
			res.render("comments/new"); 
		}
		else {
			res.redirect('/posts/' + req.params.post_id + '/comments');
		}
	});
});

//DESTROY
app.delete('/comments/:id', function(req, res){
	db.Comment.findByIdAndRemove(req.params.id, 
		function(err, comment){
			if (err) throw err; 
			//.post refers to the post id as defined within the comment schema
			res.redirect("/posts/"+ comment.post +"/comments")
		});
});

//-------------- User Routes -----------------------//


// CATCH ALL
app.get('*', function(req,res){
  res.render('404');
});

// START SERVER
app.listen(3000, function(){
  "Server is listening on port 3000";
});

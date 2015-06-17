var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"), 
	methodOverride = require("method-override"), 
	db = require("./models"); 

app.set('view engine', 'ejs'); 
app.use(methodOverride('_method')); 
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended:true})); 

//------------ POST ROUTES ----------------//
//ROOT
app.get('/', function(req, res){
	res.redirect("/posts");
});

//INDEX
app.get('/posts', function(req, res){
	db.Post.find({}, 
		function(err, posts){
			res.render('posts/index', {posts:posts});  
	});	
});

//NEW
app.get('/posts/new', function(req, res){
	res.render("posts/new");
});

//CREATE
app.post('/posts', function(req, res){
	db.Post.create({name: req.body.name, location: req.body.location}, 
		function(err, post) {
			if(err){
				console.log(err); 
				res.render("posts/new"); 
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
	db.Post.findByIdAndUpdate(req.params.id, {name: req.body.name, location: req.body.location},
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

// CATCH ALL
app.get('*', function(req,res){
  res.render('404');
});

// START SERVER
app.listen(3000, function(){
  "Server is listening on port 3000";
});

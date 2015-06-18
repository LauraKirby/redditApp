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
	db.Post.create({title: req.body.title, content: req.body.content}, 
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
	db.Post.findById(req.params.post_id).populate('animals').exec(function(err,post){
		res.render("comments/index");
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
	db.Comment.create(req.body.comment, function(err, comments){
		if(err){
			console.log(err); 
			res.render("comments/new"); 
		}
		else {
			db.Post.findById(req.params.post_id, function(err, post){
				post.comments.push(comments); 
				comments.post = post._id; 
				comments.save(); 
				post.save(); 
				res.redirect("/posts/" + req.params.post_id + "/comments"); 
			});
		}
	});
});

//SHOW
app.get('/animals/:id', function(req,res){
	db.Comment.findById(req.params.id)
	.populate('post')
	.exec(function(err, comment){
		res.render("animals/show", {comment:comment}); 
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

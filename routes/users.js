var express = require('express');
var router = express.Router();

/* check if a user is logged in */
var checklogin = function(req, res){
	if (req.session.name === undefined) {
		res.redirect('/');
	}
}

/* GET the user home page */
router.get('/', function(req, res) {
	var db = req.db;
	var posts = db.get('posts');
	checklogin(req, res);
  	posts.find({}, function(e, docs){
		res.render('users/index', {'user': req.session.name, 'individuals': docs});
	});
});

/* Logs out the user and GET home page */
router.get('/logout/', function(req, res){
	checklogin(req, res);
	req.session.destroy();
	res.redirect('/');
});

/* Called when user submits a new freet. Posts the new freet on the public wall. */
router.post('/freet', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.insert({"user": req.session.name, "post": req.body.comments}, function(err, docs){
		if(err){
			res.send("There was a problem");
		} else{
			res.redirect("/users/");
		}
	});
});

/* Called when user saves edits to a freet. Redirects to /users/ page */
router.post('/changed', function(req, res, next){
	var db = req.db;
	var posts = db.get('posts');
	if (req.body.delete == undefined){
		posts.update({'_id': req.body.id}, {$set: {'post': req.body.comments}});
	} else {
		posts.remove({_id: req.body.id});
	}
	res.redirect('/users/');
});

/* Called when a user wants to edit/delete a freet. */
router.post('/editdelete', function(req, res, next){
	var db = req.db;
	var posts = db.get('posts');
	posts.find({"_id": req.body.id}, function(e, docs){
		res.render('users/edit', {'entry': docs[0], 'pub': false});
	});
})

module.exports = router;
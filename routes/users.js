var express = require('express');
var router = express.Router();

/* check if a user is logged in. Returns true if the user is not logged in */
var checklogin = function(req, res){
	if (req.session.name === undefined) {
		res.redirect('/');
		return true;
	}
	return false;
}

/* GET the user home page */
router.get('/', function(req, res) {
	if (checklogin(req, res)) return;
	var db = req.db;
	var posts = db.get('posts');
	var users = db.get('users');
  	posts.find({}, function(e, docs){
  		users.find({'username': req.session.name}, function(e, userdocs){
  			res.render('users/index', {'user': req.session.name, 'individuals': docs, 'followed':userdocs[0].following});
  		});
	});
});

/* Logs out the user and GET home page */
router.get('/logout/', function(req, res){
	if (checklogin(req, res)) return;
	req.session.destroy();
	res.redirect('/');
});

/* GET the page to change settings on which users to follow */
router.get('/follow/', function(req, res){
	if (checklogin(req, res)) return;
	var db = req.db;
	var users = db.get('users');
	var followedUsers=[];
	var unfollowedUsers = [];
	
	users.find({}, function(e, docs){
		users.find({"username": req.session.name}, function(e, userdocs){
			followedUsers = userdocs[0].following;
	
			for (var i =0; i<docs.length; i++){
				if (followedUsers.indexOf(docs[i].username)<=-1 && docs[i].username!=req.session.name){
					unfollowedUsers.push(docs[i].username);
				}
			}
			res.render('users/follow', {'followedUsers': followedUsers, 'unfollowedUsers': unfollowedUsers});
		});
	});
});

/* Called when user follows another user */
router.post('/follow/follow', function(req, res, next){
	if (checklogin(req, res)) return;
	var db = req.db;
	var users = db.get('users');
	var following = [];
	users.find({'username': req.session.name}, function(e, docs){
		following = docs[0].following;
		if (req.body.follow == undefined) following.splice(following.indexOf(req.body.name), 1);
		else following.push(req.body.name);
		users.update(
			{'username': req.session.name}, 
			{$set: {'following': following}}
		);
		res.redirect('/users/follow/');
	});
});

/* Called when user submits a new freet. Posts the new freet on the public wall. */
router.post('/freet', function(req, res, next) {
	if (checklogin(req, res)) return;
	var db = req.db;
	var posts = db.get('posts');
	if (req.body.comments.length>0) {
		posts.insert({"username": req.session.name, "post": req.body.comments, "favorite": []}, function(err, docs){
			if(err){
				res.send("There was a problem");
			} else{
				res.redirect("/users/");
			}
		});
	}
});

/* Called when user saves edits to a freet. Redirects to /users/ page */
router.post('/editdeleted', function(req, res, next){
	if (checklogin(req, res)) return;
	var db = req.db;
	var posts = db.get('posts');
	if (req.body.delete == undefined){
		posts.update({'_id': req.body.id}, {$set: {'post': req.body.comments}});
	} else {
		posts.remove({_id: req.body.id});
	}
	res.redirect('/users/');
});

/* Called when a user wants to edit/delete/favorite a freet. */
router.post('/change', function(req, res, next){
	if (checklogin(req, res)) return;
	var db = req.db;
	var posts = db.get('posts');
	if (req.body.favorite == undefined){
		posts.find({"_id": req.body.id}, function(e, docs){
			res.render('users/edit', {'entry': docs[0]});
		});
	}
	else{
		var favorite = [];
		posts.find({'_id': req.body.id}, function(e, docs){
			favorite = docs[0].favorite;
			if (req.body.favorite == 'favorite') favorite.push(req.session.name);
			else favorite.splice(favorite.indexOf(req.session.name), 1);
			posts.update({'_id': req.body.id}, {$set: {'favorite': favorite}});
			res.redirect('/users/');
		});
	}
});

module.exports = router;
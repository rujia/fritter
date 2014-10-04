var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	req.session.destroy();
	res.render('index/index', {'message': ''});
});

/* GET newaccount page to make a new account */
router.get('/newaccount', function(req, res){
	req.session.destroy();
	res.render('index/makeaccount', {'message': ''});
});

/* Enters new user into system */
router.post('/signup', function(req, res, next){
	var db = req.db; 
	var users = db.get('users');
	users.find({"name": req.body.username}, function(err, docs){
		if(err){
			res.send("There was a problem");
		} else{
			if (docs.length === 0 && req.body.username.length>0 && req.body.password.length>=8) {
				users.insert({"name": req.body.username, "password": req.body.password}, function(err, docs){
					if(err){
						res.send("There was a problem");
					} else{
						req.session.name = req.body.username;
						res.redirect("/users/");
					}
				});
			}
			else if(docs.length!==0) {
				res.render('index/makeaccount', {'message': 'Sorry, the username already exists :('});
			}
			else if (req.body.username.length===0){
				res.render('index/makeaccount', {'message': 'Please enter a username'});
			}
			else if (req.body.password.length<8){
				res.render('index/makeaccount', {'message': 'Password must be 8 characters long'});
			}
		}
	});
});

/* Logs user in */
router.post('/login', function(req, res, next){
	var db = req.db;
	var users = db.get('users');
	users.find({"name": req.body.username}, function(err,docs){
		if(err){
			res.send("There was a problem");
		} else{
			if (docs.length > 0){
				if(docs[0].name == req.body.username && docs[0].password == req.body.password){
					req.session.name = req.body.username;
					res.redirect("/users/");
				} else{
					res.render('index/index', {'message': "The username or password you entered is incorrect."});
				}
			} else{
				res.render('index/index', {'message': "The username or password you entered is incorrect."});
			}
		}
	})
})

module.exports = router;
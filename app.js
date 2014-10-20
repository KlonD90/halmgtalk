var express = require('express');
var io = require('socket.io');
var vow = require('vow');
var express = require('express');
var session = require('express-session');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var User = require('./User.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost/halmgtalk');

app.use(session({
	secret: 'halmgtangch',
	cookie: { maxAge: 2628000000 },
	store: new (require('express-sessions'))({
		storage: 'mongodb',
		instance: mongoose, // optional
		expire: 86400 // optional
	})
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',function(req, res){
	if (req.session.passport && req.session.passport.user)
	{
		User.findOne({username: req.session.passport.user}, function(err, user){
			res.render('main', {user: user});
		});
	}
	else
		res.render('main');
});

app.get('/register', function(req, res) {
	res.render('register', { });
});

app.post('/register', function(req, res) {
	User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
		if (err) {
			return res.render('register', { error : err.message });
		}
		passport.authenticate('local')(req, res, function () {
			res.redirect('/login');
		});
	});
});

app.get('/login', function(req, res) {
	res.render('login', { user : req.user });
});

app.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/');
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.post('/update', function(req,res){
	var status = req.body.online?true:false;
	var fio = req.body.fio+'';
	var skype = req.body.skype+'';
	if (!req.session.passport || !req.session.passsport.user)
	{
		return void res.status(403).end();	
	}
	User.findOne({username: req.session.passport.user}, function(err, user){
		user.online = status;
		user.fio = fio;
		user.skype = skype;
		user.save(function(){
		});
	});
});

io.on('connection', function(socket){
	User.find({online: true}, function(err, users){
		socket.emit('init', users);
	});
});

http.listen(3000);

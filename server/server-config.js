(function(){
	var express = require('express');
	var bodyParser = require('body-parser');
	var cookieParser = require('cookie-parser');
	var partials = require('express-partials');
	var handler = require('./request-handler');
	// var session = require('express-session')
	var app = express();

	// app.set('views', __dirname + '/views');
	// app.set('view engine', 'ejs');
	// app.use(partials());
	app.use(bodyParser());
	// app.use(express.static(__dirname + '/public'));
	app.use(cookieParser('shhhh, very secret'));
	app.use(express.static(__dirname + "/dist"));

	// app.use(session());

	app.route('/api/:userId/user-info')
		.get(handler.getUserInfo)
	app.route('/api/:userId/hourly-averages')
		.get(handler.getHourlyAverages)
	app.route('/api/:userId/last-post')
		.get(handler.getLastPost)
	app.route('/api/:userId/top-post')
		.get(handler.getTopPost)
	app.route('/api/top-stories')
		.get(handler.getTopStories)
	

	module.exports = app;
})();
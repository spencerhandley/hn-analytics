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
	// app.route('/sync-data')
	// 	.get(handler.syncData)
	// app.route('/top-stories')
	// 	.get(handler.getTopStories)
	// app.route('/user/:userId/all-data')
	// 	.get(handler.getAllUserData)
	// app.route('/user/:userId/comments')
	// 	.get(handler.getAllCommentsByUser)
	// app.route('/jobs')
	// 	.get(handler.getAllJobs)
	// app.route('/jobs/:jobId')
	// 	.get(handler.getJob)
	// app.route('/jobs/:jobId/comments')
	// 	.get(handler.getJobComments)
	// app.route('/polls')
	// 	.get(handler.getAllPolls)
	// app.route('/polls/:pollId')
	// 	.get(handler.getPoll)
	// app.route('/polls/:pollId/comments')
	// 	.get(handler.getPollComments)
	// app.route('/stories')
	// 	.get(handler.getAllStories)
	// app.route('/stories/:storyId')
	// 	.get(handler.getStory)
	// app.route('/stories/:storyId/comments')
	// 	.get(handler.getStoryComments)
	// app.route('/pollopts')
	// 	.get(handler.getAllPollopts)
	// app.route('/pollopts/:polloptId')
	// 	.get(handler.getPollopt)
	// app.route('/pollopts/:polloptId/comments')
	// 	.get(handler.getPolloptComments)


	module.exports = app;
})();
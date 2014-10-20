(function(){
	var express = require('express');
	var mongoose = require('mongoose');

	// Syncs all data from HN
	// var sync = require('./sync.js')
	// sync.syncData()
	 
	var app = require('./server/server-config.js');
	app.use(express.static(__dirname + "/dist"));
	// Setup mongoose
	var db = process.env.MONGODB || 'mongodb://localhost/hnanalytics'
	mongoose.connect(db);

	console.log('Badass server now listening on port ');

	app.listen(process.env.PORT || 5000);
})();
(function(){
	var express = require('express');
	var mongoose = require('mongoose');

	// Syncs all data from HN
	// var sync = require('./sync.js')
	// sync.syncData()
	 
	var app = require('./server/server-config.js');
	var assets = "/dist"
	var bower;
	if(process.env.NODE_ENV === 'dev'){
		console.log("true")
		assets = "/app"
		bower = '/bower_components'
		app.use('/bower_components',express.static(__dirname + bower));
	}
	app.use('/',express.static(__dirname + assets));


	console.log('Badass server now listening on port ');

	app.listen(process.env.PORT || 9000);
})();
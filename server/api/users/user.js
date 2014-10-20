var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	hnId: String,
	delay: Number, 
	created: Date, 
	karma: Number, 
	about: String, 
	submitted: Array
  })

var User = mongoose.model("User", userSchema)

module.exports = User;
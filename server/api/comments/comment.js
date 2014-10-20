var mongoose = require('mongoose');
var commentSchema = mongoose.Schema({
	by: String,
	hnId: Number,
	score: Number,
	title: String, 
	type: String, 
	url: String,
	dead: Boolean,
	parent: String,
	parts: Array,
	deleted: String,
	kids: Array, 
	time: Number
})
var Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment;

var mongoose = require('mongoose');
var storySchema = mongoose.Schema({
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
var Story = mongoose.model("Story", storySchema)

module.exports = Story;
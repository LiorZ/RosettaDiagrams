
module.exports = function(mongoose) {
	
	var LinkSchema = new mongoose.Schema({
		date_created: {type:Date, 'default':Date.now},
		source:{type: mongoose.Schema.ObjectId, ref:'DiagramElement'},
		target:{type: mongoose.Schema.ObjectId, ref:'DiagramElement'},
		type:{type: String}
	});
	
	var Link = mongoose.model('Link',LinkSchema);
	
	return Link;
}
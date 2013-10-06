
module.exports = function(mongoose) {
	
	var DiagramSchema = new mongoose.Schema({
		date_created: {type:Date, 'default':Date.now},
		elements:[{type: mongoose.Schema.ObjectId, ref:'DiagramElement'}],
		admin_id: {type:mongoose.Schema.ObjectId, ref:'User', index:true}
	});
	
	var Diagram = mongoose.model('Diagram',DiagramSchema);
	
	return Diagram;
}
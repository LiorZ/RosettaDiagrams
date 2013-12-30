
module.exports = function(mongoose) {
	var FormatDate = mongoose.Schema.Types.FormatDate = require('mongoose-schema-formatdate');
	var DiagramSchema = new mongoose.Schema({
		name: {type:String},
		description:{type:String},
		date_created: {type: FormatDate, format: 'YYYY-MM-DD', 'default':Date.now, get:function(d){ return new Date(d) }},
		elements:[{type: mongoose.Schema.ObjectId, ref:'DiagramElement'}],
		owner_id: {type:mongoose.Schema.ObjectId, ref:'User', index:true}
	});
	
	var Diagram = mongoose.model('Diagram',DiagramSchema);
	
	return Diagram;
}
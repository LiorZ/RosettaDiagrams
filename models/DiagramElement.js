module.exports = function(mongoose) {
	
	var DiagramElementSchema = new mongoose.Schema({
		date_created: {type:Date, 'default':Date.now},
		links:[{type: mongoose.Schema.ObjectId, ref:'Link'}],
		diagram_id: {type:mongoose.Schema.ObjectId, ref:'Diagram', index:true},
		x:{type:Number},
		y:{type:Number},
		type:{type:String},
		attributes: [{type:mongoose.Schema.ObjectId, ref:'Attribute'}]
	});
	
	var DiagramElement = mongoose.model('DiagramElement',DiagramElementSchema);
	
	return DiagramElement;
}
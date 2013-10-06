module.exports = function(mongoose) {
	var User = require('./User')(mongoose);
	var Diagram = require('./Diagram')(mongoose);
	var Link = require('./Link')(mongoose);
	var DiagramElement = require('./DiagramElement')(mongoose);
	
	var models = {
			User: User,
			Diagram: Diagram,
			Link: Link,
			DiagramElement: DiagramElement
	};
	
	return models;
}
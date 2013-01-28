var app = app || {};

(function() {
	
	var DiagramElementList = Backbone.Collection.extend({
		model: app.DiagramElement,
		
//		initialize: function() {
//			this.listenTo(this,'add',this.addModelListener);
//		},
//		
//		addModelListener: function(model,attributes) {
//			this.listenTo(model,"change",this.invokeChangeEvent);
//		},
//		
//		invokeChangeEvent: function(model,attributes) { 
//			console.log("The collection recorded a model change" + model);
//		}
		
	});
	
	app.Elements = new DiagramElementList();
}());
define(['Backbone','BackboneRelational','models/DiagramElement','models/globals'],function(Backbone,BackboneRelational,DiagramElement,globals) {
	var DiagramElementCollection = Backbone.Collection.extend({
		model: DiagramElement,
	});
	
	globals.DiagramElementCollection = DiagramElementCollection;
	
	return DiagramElementCollection;
});
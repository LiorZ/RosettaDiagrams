var app = app || {};

(function() {
	
	app.DiagramElementList = Backbone.Collection.extend({
		model: app.DiagramElement,
		
	});
	
	app.Elements = new app.DiagramElementList();
	app.PaletteElements = new app.DiagramElementList();
	
	app.PaletteElements.on('add',function(element){

	});
	app.PaletteElements.url='../../js/json/elements.json';
}());
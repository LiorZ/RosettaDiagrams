var app = app || {};

(function() {
	
	var DiagramConnectionList = Backbone.Collection.extend({
		model: app.DiagramConnection
	});
	
	app.Connections = new DiagramConnectionList();
}());
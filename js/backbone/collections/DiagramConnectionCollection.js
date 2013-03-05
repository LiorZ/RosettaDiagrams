var app = app || {};

(function() {
	
	var DiagramConnectionList = Backbone.Collection.extend({
		model: app.DiagramConnection,
		bySource:function(elem) {
			var returned_arr = this.filter(function(dia) {return (dia.get('source') == elem);});
			if (returned_arr ==0 )
				return undefined;
			else
				return returned_arr[0];
		},
		byTarget:function(elem) {
			var returned_arr = this.filter(function(dia) {return (dia.get('target') == elem);});
			if (returned_arr ==0 )
				return undefined;
			else
				return returned_arr[0];
		},
	});
	
	app.Connections = new DiagramConnectionList();
}());
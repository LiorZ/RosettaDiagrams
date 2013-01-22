var app = app || {};
var ENTER_KEY = 13;

app.elementCounter = 0;

var mover_type = {
		jointObjColor: "90-#000-green:1-#fff",
		codeTemplate: '#xml_movers'
};

var filter_type = {
		jointObjColor: "90-#000-orange:1-#fff",
		codeTemplate: '#xml_filters'
};

$(function( $ ) {
	
	var vent = _.extend({}, Backbone.Events);
	
	app.AppView = Backbone.View.extend({
		
		el: '#container',
		connectionReady: false,
		events: {
			"click #add_mover" : "addMover",
			"click #add_connection": "toggleConnectionMode",
			"click #delete_element": "toggleDeleteMode",
			"click #add_filter" : "addFilter"
		},
		
		toggleDeleteMode: function() { 
			vent.trigger('toggleDeleteMode');
			
		},
		
		
		addFilter: function(e) {
			app.Elements.add(new app.DiagramElement({typeObj: filter_type, name:"NewFilter"}));
			
		},
		
		addMover: function(e) {
			app.Elements.add(new app.DiagramElement({typeObj: mover_type, name:"NewMover"}));
			console.log("New Mover created!");
		},
		
		toggleConnectionMode: function(e) { 
			this.connectionReady = !this.connectionReady;
			console.log("Connection mode is " + this.connectionReady);
			var conReady = this.connectionReady;
			app.Elements.each(
					function(element) {
						element.set("connectionReady",conReady);
					}
			);
		},
		
		initialize: function() {
			this.listenTo(app.Elements,'add',this.addElementView);
			this.listenTo(app.Connections,'add', this.addConnectionView);
			this.addPropertiesView();
			this.addCodeView();
		},
		
		addPropertiesView: function() {
			app.propertiesView = new app.DiagramElementPropertiesView({eventagg: vent});
		},
		
		addCodeView: function() {
			app.codeView = new app.CodeView({eventagg: vent});
		},
		
		addElementView: function(element) {
			var view = new app.DiagramElementView({model: element, eventagg: vent});
			view.render();
			var ElementsArr = [];
			app.Elements.each(
					function(element) {
						ElementsArr.push(element.get('jointObj'));
					}
			);
			
			app.Connections.each(
					function(connection) { 
						var conObj = connection.get('jointObj');
						conObj.register(ElementsArr);
					}
			);
		},
		
		addConnectionView: function(connection) {
			this.toggleConnectionMode(null);
			var view = new app.DiagramConnectionView({model:connection});
			var connectionObj = connection.get('jointObj');
			view.render();
			var arr = [];
			app.Elements.each(
					function(element) {
						var jointObj = element.get('jointObj');
						arr.push(jointObj);
					}
			);
			connectionObj.register(arr);
		},
		
		render: function() {
			Joint.paper("world",800,800);
		}
		
	});
	
	
	//Create the event aggregator:
});
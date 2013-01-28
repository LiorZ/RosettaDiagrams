var app = app || {};
var ENTER_KEY = 13;

app.elementCounter = 0;

var mover_type = {
		jointObjColor: "90-#000-green:1-#fff",
		codeTemplate: '#xml_movers',
		add_protocol: 'mover_name',
};

var filter_type = {
		jointObjColor: "90-#000-orange:1-#fff",
		codeTemplate: '#xml_filters',
		add_protocol: 'filter_name'
};

$(function( $ ) {
	
	var vent = _.extend({}, Backbone.Events);
	
	app.AppView = Backbone.View.extend({
		
		el: '#container',
		connectionReady: false,
		events: {
			"click #add_mover" : "addMover",
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

		},
		
		initialize: function() {
			this.listenTo(app.Elements,'add',this.addElementView);
			this.listenTo(app.Connections,'add', this.addConnectionView);
			this.addPropertiesView();
			this.addCodeView();
			this.addMenuView();
		},
		
		addPropertiesView: function() {
			app.propertiesView = new app.DiagramElementPropertiesView({eventagg: vent});
		},
		
		addCodeView: function() {
			app.codeView = new app.CodeView({eventagg: vent});
		},
		
		addMenuView: function() {
			app.menuView = new app.MenuView({eventagg: vent});
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
						//Set the connection mode off:
						element.set('connectionReady',false);
					}
			);
			connectionObj.register(arr);
		},
		
		render: function() {
			Joint.paper("world",1000,600);
		}
		
	});
	
	
	//Create the event aggregator:
});
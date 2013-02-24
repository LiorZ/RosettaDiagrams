var app = app || {};
var consts = consts || {};
var ENTER_KEY = 13;


$(function( $ ) {
	app.elementCounter = 0;
	app.Attributes = {
			'mover':{
				jointObjColor: "90-#000-green:1-#fff",
				codeTemplate: '#xml_movers',
				add_protocol: 'mover_name',
				palette_div:'#movers_menu'
			},
			'filter':{
				jointObjColor: "90-#000-orange:1-#fff",
				codeTemplate: '#xml_filters',
				add_protocol: 'filter_name',
				palette_div:'#filters_menu'
			},
			'task_operation': {
				jointObjColor: "90-#000-blue:1-#fff",
				codeTemplate: '#xml_task_operations',
				palette_div: '#task_operations_menu'
			
			}
	};
	consts.ATTR_IN_DIAGRAM_VIEW = 5;
	consts.LENGTH_DIAGRAM_TITLE = 20;
	var vent = _.extend({}, Backbone.Events);
	app.connection_views =[];
	
	app.print_connections = function() { for (var i=0; i<app.connection_views.length; ++i) { console.log("From" + app.connection_views[i].model.get("source").get("attributes").byKey("name").get("value") + " To " + app.connection_views[i].model.get("target").get("attributes").byKey("name").get("value")) } }
	app.AppView = Backbone.View.extend({
		
		el: '#container',
		connectionReady: false,
		
		toggleDeleteMode: function() { 
			vent.trigger('toggleDeleteMode');
		},
		
		initialize: function() {
			this.listenTo(app.Elements,'add',this.addElementView);
			this.listenTo(app.Connections,'add', this.addConnectionView);
			this.addPropertiesView();
			this.addCodeView();
			this.addMenuView();
			this.addPaletteView();
		},
		addPaletteView:function() {
			app.paletteView = new app.PaletteView({model: app.PaletteElements});
			app.paletteView.render();
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
			var view = new app.DiagramConnectionView({model:connection});
			app.connection_views.push(view);
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
			Joint.paper("world");
			this.$("#attribute_list").tablesorter();
			this.$("button").button();
			this.$("#menu").accordion({heightStyle: "fill", autoHeight:true});
			this.$("#menu").accordion('refresh');
			
			//Fixing the palette label:
			var width = this.$("#menu_label").width();
		}
		
	});
	
	
});
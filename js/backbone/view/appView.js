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
				palette_div:'#movers_menu',
				wiki_address:'wiki/movers.html#'
			},
			'filter':{
				jointObjColor: "90-#000-orange:1-#fff",
				codeTemplate: '#xml_filters',
				add_protocol: 'filter_name',
				palette_div:'#filters_menu',
				wiki_address:'wiki/filters.html#'
			},
			'task_operation': {
				jointObjColor: "90-#000-blue:1-#fff",
				codeTemplate: '#xml_task_operations',
				palette_div: '#task_operations_menu',
				wiki_address:'wiki/task_operations.html#'
			
			},
			'container':{
				jointObjColor: "90-#000-yellow:1-#fff",
				codeTemplate: '#xml_movers',
				palette_div: '#containers_menu',
			}
	};
	consts.ATTR_IN_DIAGRAM_VIEW = 5;
	consts.LENGTH_DIAGRAM_TITLE = 20;
	consts.MENU_TIMEOUT = 2000;
	consts.DIAGRAM_ELEMENT_DEFAULT_WIDTH = 150;
	consts.DIAGRAM_ELEMENT_DEFAULT_HEIGHT = 100;
	consts.DIAGRAM_ELEMENT_SMALL_SCALE_WIDTH = 90
	consts.DIAGRAM_ELEMENT_SMALL_SCALE_HEIGHT = 60;
	consts.DIAGRAM_CONTAINER_DEFAULT_WIDTH = 300;
	consts.DIAGRAM_CONTAINER_DEFAULT_HEIGHT = 400;
	app.EventAgg = _.extend({}, Backbone.Events);
	
	app.AppView = Backbone.View.extend({
		
		el: '#container',
		connectionReady: false,
		
		toggleDeleteMode: function() { 
			app.EventAgg.trigger('toggleDeleteMode');
		},
		
		handle_key_press: function(e) {
			if ( e.keyCode == 27 && app.pendingConnection != undefined) { //ESC char
				app.pendingConnection = undefined;
				app.EventAgg.trigger('connection_mode_ended');
			}
		},
		initialize: function() {
			this.listenTo(app.Elements,'add',this.addElementView);
			this.listenTo(app.Connections,'add', this.addConnectionView);
			$(document).bind('keyup',this.handle_key_press);
			this.addPropertiesView();
			this.addCodeView();
			this.addMenuView();
			this.addPaletteView();
			this.addInformationMessageContainer();
		},
		addPaletteView:function() {
			app.paletteView = new app.PaletteView({model: app.PaletteElements});
			app.paletteView.render();
		},
		addPropertiesView: function() {
			app.propertiesView = new app.DiagramElementPropertiesView({eventagg: app.EventAgg});
		},
		
		addCodeView: function() {
			app.codeView = new app.CodeView({eventagg: app.EventAgg});
		},
		
		addMenuView: function() {
			app.menuView = new app.MenuView({eventagg: app.EventAgg});
		},
		addElementView: function(element) {
			var view = 0;
			if ( element.get('type') == 'container' )
				view = new app.DiagramContainerView({model: element, eventagg: app.EventAgg});
			else{
				view = new app.DiagramElementView({model: element, eventagg: app.EventAgg});
			}
			view.render();
		},
		
		addConnectionView: function(connection) {
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
		addInformationMessageContainer:function() {
			app.InformationMessageContainer = new app.InformationMessageView();
		},
		
		render: function() {
			Joint.paper("world");
			this.$("#attribute_list").tablesorter();
			this.$("button").button();
			this.$("#menu").accordion({heightStyle: "fill", autoHeight:true});
			this.$("#menu").accordion('refresh');
		}
		
	});
	
	
});
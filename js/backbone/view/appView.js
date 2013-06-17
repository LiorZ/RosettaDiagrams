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
			'logic':{
				jointObjColor: "90-#000-red:1-#fff",
				codeTemplate: '#xml_movers',
				add_protocol: 'mover_name',
				palette_div:'#logic_menu',
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
				palette_div: '#containers_menu'
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
	app.MainDiagram = new app.Diagram();
	app.ActiveDiagram = app.MainDiagram;
	app.AppView = Backbone.View.extend({
		main_joint: undefined,
		el: '#container',
		connectionReady: false,
		viewBoxHeight: 0,
		viewBoxWidth:0,
		viewBox:{
			X:0,
			Y:0
		},
		events: {
			"mousewheel":"handle_mouse_wheel"
		},
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
			this.add_element_listeners();
			$(document).bind('keyup',this.handle_key_press);
			this.addPropertiesView();
			this.addCodeView();
			this.addMenuView();
			this.addPaletteView();
			this.addInformationMessageContainer();
			_.bindAll(this.show_main_canvas);
			this.listenTo(app.EventAgg,'show_main_canvas',this.show_main_canvas);
			this.listenTo(app.EventAgg,'switch_diagram',this.switch_diagram);
		},
		
		add_element_listeners: function() {
			this.listenTo(app.ActiveDiagram,'add:element',this.addElementView);
			this.listenTo(app.ActiveDiagram,'add:connection', this.addConnectionView);
		},
		
		switch_diagram: function(diagram) {
			this.stopListening(app.ActiveDiagram);
			app.ActiveDiagram = diagram;
			Joint.paper(diagram.get('jointObj'));
			this.add_element_listeners();
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
			var view = new app.DiagramElementView({model: element, eventagg: app.EventAgg});
			view.render();
		},
		
		addConnectionView: function(connection) {
			var view = new app.DiagramConnectionView({model:connection});
			view.render();
		},

		addInformationMessageContainer:function() {
			app.InformationMessageContainer = new app.InformationMessageView();
		},
		
		render: function() {
			this.main_joint = Joint.paper("world");
//			this.viewBoxHeight = this.main_joint.height;
//			this.viewBoxWidth = this.main_joint.width;
//			
//			var oX = 0, oY=0;
//			this.viewBox = this.main_joint.setViewBox(oX, oY, this.viewBoxWidth, this.viewBoxHeight);
//			this.viewBox.X = oX;
//			this.viewBox.Y = oY;
//			
			app.MainDiagram.set('jointObj',this.main_joint);
			this.$("#attribute_list").tablesorter();
			this.$("button").button();
			this.$("#menu").accordion({heightStyle: "fill", autoHeight:true});
			this.$("#menu").accordion('refresh');
		},
		
		zoom: function(delta) {
	        vBHo = this.viewBoxHeight;
	        vBWo = this.viewBoxWidth;
	        if (delta < 0) {
	        this.viewBoxWidth *= 0.95;
	        this.viewBoxHeight*= 0.95;
	        }
	        else {
	        this.viewBoxWidth *= 1.05;
	        this.viewBoxHeight *= 1.05;
	        }
	                        
	        this.viewBox.X -= (this.viewBoxWidth - vBWo) / 2;
	        this.viewBox.Y -= (this.viewBoxHeight - vBHo) / 2;          
	        this.main_joint.setViewBox(this.viewBox.X,this.viewBox.Y,this.viewBoxWidth,this.viewBoxHeight);
		},
		handle_mouse_wheel:function(e,delta) {
//            var delta = 0;
//            if (!event) /* For IE. */
//                    event = window.event;
//            if (event.wheelDelta) { /* IE/Opera. */
//                    delta = event.wheelDelta/120;
//            } else if (event.detail) { /** Mozilla case. */
//                    /** In Mozilla, sign of delta is different than in IE.
//                     * Also, delta is multiple of 3.
//                     */
//                    delta = -event.detail/3;
//            }
//            /** If delta is nonzero, handle it.
//             * Basically, delta is now positive if wheel was scrolled up,
//             * and negative, if wheel was scrolled down.
//             */
//            if (delta)
//                    this.zoom(delta);
//            /** Prevent default actions caused by mouse wheel.
//             * That might be ugly, but we handle scrolls somehow
//             * anyway, so don't bother here..
//             */
//            if (event.preventDefault)
//                    event.preventDefault();
//            event.returnValue = false;
		}
		
	});
	
	
});
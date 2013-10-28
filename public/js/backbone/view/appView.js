//	app.elementCounter = 0;
//	app.Attributes = {
//			'mover':{
//				jointObjColor: "90-#000-green:1-#fff",
//				codeTemplate: '#xml_movers',
//				add_protocol: 'mover_name',
//				palette_div:'#movers_menu',
//				wiki_address:'wiki/movers.html#'
//			},
//			'logic':{
//				jointObjColor: "90-#000-red:1-#fff",
//				codeTemplate: '#xml_movers',
//				add_protocol: 'mover_name',
//				palette_div:'#logic_menu',
//				wiki_address:'wiki/movers.html#'
//			},
//			'filter':{
//				jointObjColor: "90-#000-orange:1-#fff",
//				codeTemplate: '#xml_filters',
//				add_protocol: 'filter_name',
//				palette_div:'#filters_menu',
//				wiki_address:'wiki/filters.html#'
//			},
//			'task_operation': {
//				jointObjColor: "90-#000-blue:1-#fff",
//				codeTemplate: '#xml_task_operations',
//				palette_div: '#task_operations_menu',
//				wiki_address:'wiki/task_operations.html#'
//			
//			},
//			'container':{
//				jointObjColor: "90-#000-yellow:1-#fff",
//				codeTemplate: '#xml_movers',
//				palette_div: '#containers_menu'
//			}
//	};
//	consts.ATTR_IN_DIAGRAM_VIEW = 5;
//	consts.LENGTH_DIAGRAM_TITLE = 20;
//	consts.MENU_TIMEOUT = 2000;
//	consts.DIAGRAM_ELEMENT_DEFAULT_WIDTH = 150;
//	consts.DIAGRAM_ELEMENT_DEFAULT_HEIGHT = 100;
//	consts.DIAGRAM_ELEMENT_SMALL_SCALE_WIDTH = 90;
//	consts.DIAGRAM_ELEMENT_SMALL_SCALE_HEIGHT = 60;
//	consts.DIAGRAM_CONTAINER_DEFAULT_WIDTH = 300;
//	consts.DIAGRAM_CONTAINER_DEFAULT_HEIGHT = 400;
//	app.EventAgg = _.extend({}, Backbone.Events);
//	app.MainDiagram = new app.Diagram();
//	app.ActiveDiagram = app.MainDiagram;
	
define(['Backbone','views/globals','models/globals','models/PaletteElements','views/DiagramElementView','views/DiagramConnectionView','views/InformationMessageView','views/CodeView'
        ,'views/DiagramElementPropertiesView', 'views/MenuView','views/PaletteView'],
		function(Backbone,view_globals,model_globals,PaletteElements,DiagramElementView,DiagramConnectionView,InformationMessageView,CodeView,DiagramElementPropertiesView,MenuView,
				PaletteView) {
	var AppView = Backbone.View.extend({
		main_joint: undefined,
		el: '#container',
		events:{
			'click #btn_paste_code':'paste_code',
		},
		
		connectionReady: false,
		toggleDeleteMode: function() { 
			view_globals.event_agg.trigger('toggleDeleteMode');
		},
		
		handle_key_press: function(e) {
			if ( e.keyCode == 27 ) { //ESC char
				model_globals.pendingConnection = undefined;
				view_globals.event_agg.trigger('connection_mode_ended');
			}
		},
		initialize: function(options) {
			this.add_element_listeners();
			var palette_model = options.palette;
			$(document).bind('keyup',this.handle_key_press);
			this.addPropertiesView();
			this.addCodeView();
			this.addMenuView();
			this.addPaletteView(palette_model);
			this.addInformationMessageContainer();
			_.bindAll(this.show_main_canvas);
			this.listenTo(view_globals.event_agg,'show_main_canvas',this.show_main_canvas);
			this.listenTo(view_globals.event_agg,'switch_diagram',this.switch_diagram);
		},
		
		add_element_listeners: function() {
			this.listenTo(model_globals.ActiveDiagram,'add:element',this.addElementView);
			this.listenTo(model_globals.ActiveDiagram,'add:connection', this.addConnectionView);
		},
		
		paste_code: function(){
			$('#paste_code_dialog').dialog('open');
		},
		
		switch_diagram: function(diagram) {
			this.stopListening(model_globals.ActiveDiagram);
			model_globals.ActiveDiagram = diagram;
			Joint.paper(diagram.get('jointObj'));
			this.add_element_listeners();
		},
		
		addPaletteView:function(model) {
			this.paletteView = new PaletteView({model: model});
			this.paletteView.render();
		},
		
		addPropertiesView: function() {
			this.propertiesView = new DiagramElementPropertiesView({eventagg: view_globals.event_agg});
		},
		
		transformXMLToDiagram: function(xml_str) {
			app.XMLToDiagram(xml_str);
		},
		
		addCodeView: function() {
			var context = this;
			var plot_diag_func = function(dialog_obj) {
				var xml_str = $(dialog_obj).find('textarea').val();
				model_globals.MainDiagram.clear();
				context.transformXMLToDiagram(xml_str);
				$(dialog_obj).dialog('close');
			}
			
			$('#paste_code_dialog').dialog({
				title:'Diagram from RosettaScript',
				width:800,
				height:400,
				autoOpen:false,
				modal:true,
				buttons: {
					OK: function(){
						var xml_diag = this;
						if (model_globals.MainDiagram.get_elements().size() > 0) {
							$( "#dialog-confirm" ).dialog({
							      resizable: false,
							      modal: true,
							      width:400,
							      buttons: {
							        "Do it!": function() {
							          $( this ).dialog( "close" );
							          plot_diag_func(xml_diag);
							        },
							        "Just a sec...": function() {
							          $( this ).dialog( "close" );
							        }
							      }
							});
						}else {
							plot_diag_func(this)
						}
					},
					Cancel: function() {
						$(this).dialog('close');
					}
				}
			});
			
			view_globals.codeView = new CodeView({eventagg: view_globals.event_agg});
		},
		
		addMenuView: function() {
			this.menuView = new MenuView({eventagg: view_globals.event_agg});
		},
		/*
		 * Returns a position for the new page , in the middle of the editor, takes into account translate and zoom..
		 */
		getPosForNewPage: function() {
			var jointObj = model_globals.ActiveDiagram.get('jointObj');
			if ( jointObj == undefined ){
				return undefined;
			}
			var newPos = {
					x: (jointObj.viewBoxWidth/2+jointObj.viewBox.X),
					y: (jointObj.viewBoxHeight/2+jointObj.viewBox.Y)
			};
			
			return newPos;
		},
		
		addElementView: function(element) {
			if ( _.isUndefined(element.get('x')) && _.isUndefined(element.get('y') )){
				var new_pos = this.getPosForNewPage();
				element.set(new_pos);
			}
			var view = new DiagramElementView({model: element, eventagg: view_globals.event_agg});
			view.render();
		},
		
		addConnectionView: function(connection) {
			var view = new DiagramConnectionView({model:connection});
			view.render();
		},

		addInformationMessageContainer:function() {
			view_globals.InformationMessageContainer = new InformationMessageView();
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
			model_globals.MainDiagram.set('jointObj',this.main_joint);
			this.$("#attribute_list").tablesorter();
			this.$("button").button();
			this.$("#menu").accordion({heightStyle: "fill", autoHeight:false});
			$("#container").show();
			this.$("#menu").accordion('refresh');

		}
		
	});
	
	return AppView;
});
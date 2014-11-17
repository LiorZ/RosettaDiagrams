	
define(['Backbone','views/globals','models/globals','models/PaletteElements','views/DiagramElementView','views/DiagramConnectionView','views/InformationMessageView','views/CodeView','views/DiagramElementPropertiesView', 'views/MenuView','views/PaletteView','../jobdialog'],
		function(Backbone,view_globals,model_globals,PaletteElements,DiagramElementView,DiagramConnectionView,InformationMessageView,CodeView,DiagramElementPropertiesView,MenuView,
				PaletteView, jobdialog) {
	var AppView = Backbone.View.extend({
		main_joint: undefined,
		el: '#container',
		events:{
			'click #btn_paste_code':'paste_code',
			'click #play':'launch_diagram'
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
			this.addToolBar();
			this.addInformationMessageContainer();
			_.bindAll(this.show_main_canvas);
			this.listenTo(view_globals.event_agg,'show_main_canvas',this.show_main_canvas);
			this.listenTo(view_globals.event_agg,'switch_diagram',this.switch_diagram);
		},
		
		addToolBar: function() {
		        var maint = $('#main_toolbar');
		        maint.find('#play').button({
		              text: false,
                              icons: {
                                primary: "ui-icon-play"
                              }
                        });
		},
		
		add_element_listeners: function() {
			this.listenTo(model_globals.ActiveDiagram,'add:elements',this.addElementView);
			this.listenTo(model_globals.ActiveDiagram,'add:connections', this.addConnectionView);
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
		
		addPaletteView:function(json_models) {
			this.paletteView = new PaletteView({json_models: json_models});
			this.paletteView.render();
		},
		
		addPropertiesView: function() {
			this.propertiesView = new DiagramElementPropertiesView({eventagg: view_globals.event_agg});
		},
		
		transformXMLToDiagram: function(xml_str) {
			app.XMLToDiagram(xml_str);
		},
		launch_diagram:function() {
		        $.getJSON("/data/jobdefs/xmlscript_generic.json",function(data) {
		                var xml = $('#code').text().replace(/^\s*[\r\n]/gm,"");
		                data.xmlscript.content=xml;
		                JobDialogManager.open_job_dialog(data);
		        });
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
		
		
		draw_elements: function() {
			var elements = model_globals.MainDiagram.get('elements');
			var view = this
			elements.each(function(elem) {
				view.addElementView(elem);
			});
			
			//need to draw all elements before drawing the connections between them
			elements.each(function(elem){
				var cons = elem.get('connections');
				cons.each(function(c) {
					new DiagramConnectionView({model:c});
				})
			});
		},
		render: function() {

			model_globals.MainDiagram.set('jointObj',this.main_joint);
			this.$("#attribute_list").tablesorter();
			this.$("button").button();
			this.$("#menu").accordion({heightStyle: "fill", autoHeight:false});
			$("#container").show();
			this.$("#menu").accordion('refresh');
			this.main_joint = Joint.paper("world",9000,9000);
			this.draw_elements();
			prettyPrint();
			
		}
		
	});
	
	return AppView;
});

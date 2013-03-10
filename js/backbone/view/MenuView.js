var app = app || {};
$(function() {
	
	app.MenuView = Backbone.View.extend({
		el:'#toolbar',
		eventagg: undefined,
		timeoutId: undefined,
		connectionReady: undefined,
		events:{
			'mouseenter':'mouseenter',
			'mouseleave':'hide_menu_delay',
			'click #btn_delete' : 'delete_element',
			'click #btn_connect' : 'connect_element',
			'click #btn_info': 'show_info'
		},
		
		delete_element: function() { 
			this.model.destroy();
			this.model = undefined;
			this.hide_menu_now();
		},
		get_current_model_name:function() {
			return this.model.get('name');
		},
		show_info:function(e){
			var wiki_obj =$('#wiki_info'); 
			var frame_src = app.Attributes[this.model.get('type')].wiki_address+this.model.get('name');
			wiki_obj.find('iframe').attr('src', frame_src);
			wiki_obj.dialog('option','title',this.model.get('name')).dialog('open');
		},
		
		initialize: function(options) {
			this.$("#btn_delete").button({
				text: false,
				icons: {
					primary: 'ui-icon-trash'
				}
			});
			this.eventagg = options.eventagg;
			this.$("#btn_connect").button({
				text: false,
				icons:{
					primary: 'ui-icon-arrowthick-1-e'
				}
			});
			this.$("#btn_info").button({
				text: false,
				icons:{
					primary: 'ui-icon-info'
				}
			});
		    $( "#wiki_info" ).dialog({
		        autoOpen: false,
		        modal: true,
		        width: window.innerWidth*0.35,
		        height: window.innerHeight*0.35,
		        open: function (event, ui) {
		            $('#wiki_info').css('overflow', 'hidden'); //this line does the actual hiding
		        }
		      });
		    $('#wiki_info').find('iframe').load($('#wiki_info').find('iframe').css('display','inline')); 
		    
			_.bindAll(this, "show_menu_delay");
			this.eventagg.bind("show_menu_delay",this.show_menu_delay);
			_.bindAll(this, "hide_menu_delay");
			this.eventagg.bind("hide_menu_delay",this.hide_menu_delay);
			_.bindAll(this, "hide_menu_now");

			this.eventagg.bind("hide_menu_now",this.hide_menu_now);

		},
		
		show_menu_delay:function(element,pos,width,height){
			this.model = element;
			clearTimeout(this.timeoutId);
			
			if ( this.model == undefined ){
				alert("ERROR: Undefined element!");
				return;
			}
			
			//Not allowing more than one outgoing connection:
			if ( this.model.get('type') != 'task_operation' && app.Connections.bySource(this.model) != undefined) {
				this.$('#btn_connect').button({disabled: true});
			}else { 
				this.$('#btn_connect').button({disabled: false});
			}
			
			this.$el.css(
				{
					display:'inline',
					left: pos.left+'px',
					top: pos.top-this.$el.height()-23 +'px'
				}
			);
		},
		mouseenter: function(e) {
			clearTimeout(this.timeoutId);
		},
		
		hide_menu_now: function(e) { 
			this.hide_menu_delay(0);
		},
		hide_menu_delay: function(time_out){
			if ( time_out == undefined )
				time_out = consts.MENU_TIMEOUT;	
			clearTimeout(this.timeoutId);
			var obj = this.$el;
			var t = this;
			this.timeoutId = setTimeout(function() {
				obj.css({
					display: 'none'
				});
				t.model = undefined;
			},time_out);
		},
		
		connect_element:function() {
			this.connectionReady = true;
			console.log("Connection mode is " + this.connectionReady);
			var conReady = this.connectionReady;
			app.Elements.each(
					function(element) {
						element.set("connectionReady",conReady);
					}
			);
			var type = this.model.get('type');
			if ( type == 'task_operation' ) {
				app.pendingConnection = new app.DiagramContainment({source: this.model, type: Joint.dia.uml.generalizationArrow});
			}else {
				app.pendingConnection = new app.DiagramConnection({source: this.model, type: Joint.dia.uml.dependencyArrow});
			}
			
			var info_msg_model = new app.InformationMessage({message: "Click on the element you want to connect ... (<b>ESC</b> to cancel) "});
			app.EventAgg.trigger('connection_mode_activated',{info_msg: info_msg_model});

		}
	});
});
var app = app || {};
$(function() {
	
	app.MenuView = Backbone.View.extend({
		el:'#toolbar',
		eventagg: undefined,
		timeoutId: undefined,
		connectionReady: undefined,
		events:{
			'mouseenter':'mouseenter',
			'mouseleave':'mouseleave',
			'click #btn_delete' : 'delete_element',
			'click #btn_connect' : 'connect_element'
		},
		
		delete_element: function() { 
			this.model.destroy();
			this.model = undefined;
			this.hide_menu_now();
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
			this.$el.css(
				{
					display:'inline',
					left: pos.left+'px',
					top: pos.top-this.$el.height()-12+'px'
				}
			);
		},
		mouseenter: function(e) {
			clearTimeout(this.timeoutId);
		},
		
		hide_menu_now: function(e) { 
			clearTimeout(this.timeoutId);
			this.$el.css({
				display: 'none'
			});
			this.model = undefined;
		},
		
		mouseleave: function(e){ 
			clearTimeout(this.timeoutId);
			var t = this;
			var obj = this.$el;
			this.timeoutId = setTimeout(function() {
				obj.css({
					display: 'none'
				});
				t.model = undefined;
			},2000);
		},
		
		hide_menu_delay: function(){
			clearTimeout(this.timeoutId);
			var obj = this.$el;
			var t = this;
			this.timeoutId = setTimeout(function() {
				obj.css({
					display: 'none'
				});
				t.model = undefined;
			},2000);
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

		}
	});
});
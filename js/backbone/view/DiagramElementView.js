var app = app || {};
$(function() {
	
	app.DiagramElementView = Backbone.View.extend({
		tagName: 'rect',
		eventagg: undefined,
		initialize: function(options) {
			var type = this.model.get('typeObj');
			var jointObj = Joint.dia.uml.State.create({
				  rect: {x: this.model.get('x'), y: this.model.get('y'), width: 150, height: 100},
				  label: this.model.get('name'),
				  attrs: {
				    fill: type.jointObjColor
				  },
				  shadow: true,
				  actions: {
					inner: []
				  }
			});
			
			this.$el = jQuery(jointObj.wrapper.node);
			this.eventagg = options.eventagg;
			this.model.set('jointObj',jointObj);
			this.listenTo(this.model,"change",this.model_changed);
			this.listenTo(this.model, 'destroy',this.destroyElement);

			
			_.bindAll(this, "toggleHighlight");
			this.eventagg.bind("toggleDeleteMode",this.toggleDeleteMode);
			
			this.eventagg.bind('editDiagramElement',this.toggleHighlight);
			this.model_changed();
		},
		destroyElement:function() {
			var jointObj = this.model.get('jointObj');
			for (var i=0; i<jointObj.inner.length; ++i) {
				jointObj.inner[i].remove();
			}
			jointObj.shadow.remove();
			jointObj.liquidate();
			console.log(jointObj);
			this.stopListening();
			this.eventagg.off('toggleDeleteMode', this.toggleDeleteMode);
			this.eventagg.off('editDiagramElement', this.toggleHighlight);
//		    this.undelegateEvents();
			this.remove();
		},
		
		//Toggles the highlighting of an element upon clicking on it.
		toggleHighlight: function(element){ 
			console.log(this.model.get('name'));
			var jointObj = this.model.get('jointObj');
			if (element == this.model) {
				jointObj.highlight();
			}else {
				jointObj.unhighlight();
			}
			
		},
		
		toggleDeleteMode: function() {
			var delMode = this.model.get('deleteMode');
			this.model.set('deleteMode',!delMode);
			
		},
		
		model_changed: function(){
			console.log("Model changed!!");
			var jointObj = this.model.get('jointObj');
			jointObj.properties.label = this.model.get('name');
			this.refresh_attributes();
			jointObj.zoom();
		},
		
		refresh_attributes: function() {
			var attributes = this.model.get('attributes');
			var jointObj = this.model.get('jointObj');
			jointObj.properties.actions.inner = [];
			attributes.each(function (attribute)  { 
				jointObj.properties.actions.inner.push(attribute.get("key"));
				jointObj.properties.actions.inner.push(attribute.get("value"));
			});
		},
		events: {
			"mouseup": "mouseUp",
			"click": "elementClicked",
			"mousedown": "mouseDown",
			"mouseenter":"mouseenter",
			"mouseleave":"mouseleave"
		},
		
		
		render:function() {

		},
		
		mouseUp: function(e) { 
//			var deleteMode = this.model.get('deleteMode');
//			console.log("Delete mode is ", deleteMode);
//			if ( deleteMode ) {
//				var jointObj = this.model.get('jointObj');
//				jointObj.shadow.remove();
//				jointObj.remove();
//				this.model.destroy();
//				this.eventagg.trigger("toggleDeleteMode");
//				this.remove();
//			}
//			
			var pos = this.$el.offset();
			this.eventagg.trigger('show_menu_delay',this.model,pos);
			
			var connectionMode = this.model.get("connectionReady");
			if ( ! connectionMode ) {
				this.eventagg.trigger('editDiagramElement',this.model);
			}
		},
		
		elementClicked: function(e) {
			console.log("mouse clicked");
		},
		
		mouseenter: function(e) { 
			var pos = this.$el.offset();
			this.eventagg.trigger('show_menu_delay',this.model,pos);
		},
		mouseleave: function(e){
			this.eventagg.trigger('hide_menu_delay');
		},
		mouseDown: function(e) {
			
			var connectionMode = this.model.get("connectionReady");
			this.eventagg.trigger('hide_menu_now');
			if ( connectionMode == true ) { 
				console.log("Connection mode is true");
				if ( app.pendingConnection == undefined ) {
					console.log("Setting source to be ... " + this.model);
					app.pendingConnection = new app.DiagramConnection({source: this.model});
				}else { 
					console.log("Adding new connection to the list");
					app.pendingConnection.set("target",this.model);
					app.Connections.add(app.pendingConnection);
					app.pendingConnection = undefined;
				}
				
			}
			
		}
		
	});
	
});
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
			_.bindAll(this, "toggleDeleteMode");
			this.eventagg.bind("toggleDeleteMode",this.toggleDeleteMode);
			this.model_changed();
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
			"mousedown": "mouseDown"
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
			
			var connectionMode = this.model.get("connectionReady");
			if ( ! connectionMode ) {
				this.eventagg.trigger('editDiagramElement',this.model);
			}
		},
		
		elementClicked: function(e) {
			console.log("mouse clicked");
		},
		mouseDown: function(e) {
			
			var connectionMode = this.model.get("connectionReady");
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
var app = app || {};

$(function() {
	
	app.DiagramElementView = Backbone.View.extend({
		tagName: 'rect',
		eventagg: undefined,
		
		events: {
			"mouseup": "mouseUp",
			"mousedown": "mouseDown",
			"mouseenter":"mouseenter",
			"mouseleave":"mouseleave"
		},
		
		initialize: function(options) {
			var type = this.model.get('typeObj');
			
			var jointObj = Joint.dia.uml.State.create({
				  rect: {x: this.model.get('x'), y: this.model.get('y'), width: this.model.get('width'), height:this.model.get('height')},
				  label: this.model.get('name').slice(0,consts.LENGTH_DIAGRAM_TITLE),
				  attrs: {
				    fill: type.jointObjColor
				  },
				  shadow: true,
				  actions: {
					inner: []
				  }
			});
			
			this.$el = jQuery(jointObj.wrapper.node);
			this.model.set('jointObj',jointObj);
			this.listenTo(this.model,"change:name",this.model_changed);
			this.listenTo(this.model,"change:attributes",this.refresh_attributes);
			this.listenTo(this.model, 'destroy',this.destroyElement);
			_.bindAll(this, "toggleHighlight");
			app.EventAgg.bind("toggleDeleteMode",this.toggleDeleteMode);
			app.EventAgg.bind('editDiagramElement',this.toggleHighlight);
			var context = this;
			jointObj.registerCallback('elementMoved',function(new_loc){
				console.log(new_loc);
				context.model.set('x',new_loc.x);
				context.model.set('y',new_loc.y);
			});
			this.model_changed();
			this.refresh_attributes();
		},
		
		destroyElement:function() {
			var jointObj = this.model.get('jointObj');
			for (var i=0; i<jointObj.inner.length; ++i) {
				jointObj.inner[i].remove();
			}
			jointObj.shadow.remove();
			jointObj.liquidate();
			this.stopListening();
			app.EventAgg.off('editDiagramElement', this.toggleHighlight);
			this.remove();
		},
			
		//Toggles the highlighting of an element upon clicking on it.
		toggleHighlight: function(element){ 
			if ( this.model.get('parent_diagram') != app.ActiveDiagram ) {
				return;
			}
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
			var jointObj = this.model.get('jointObj');
			jointObj.properties.label = this.model.get('name').slice(0,consts.LENGTH_DIAGRAM_TITLE);
			jointObj.zoom();
		},
		
		refresh_attributes: function() {
			var raw_attributes = this.model.get('attributes');
			if (raw_attributes == undefined) {
				alert("ERROR: attributes are undefined");
				return;
			}
			var attributes = raw_attributes.nonEmpty();
			if (attributes == undefined || attributes.length == 0 ){
				alert("No defined attributes!");
				return;
			}
			var jointObj = this.model.get('jointObj');
			jointObj.properties.actions.inner = [];
			
			for (var i=0; i<Math.min(consts.ATTR_IN_DIAGRAM_VIEW,attributes.length); ++i) {
				jointObj.properties.actions.inner.push(attributes[i].get("key"));
				var actual_value = attributes[i].get('value')
				var value_attr = actual_value.length>9?actual_value.substr(0,9)+'...':actual_value;
				jointObj.properties.actions.inner.push(value_attr);
			}
			jointObj.zoom();
		},
		
		mouseUp: function(e) { 
			var pos = this.$el.offset();
			app.EventAgg.trigger('show_menu_delay',this.model,pos);
			
			var connectionMode = this.model.get("connectionReady");
			app.EventAgg.trigger('editDiagramElement',this.model);
		},
		
		mouseenter: function(e) { 
			var pos = this.$el.offset();
			app.EventAgg.trigger('show_menu_delay',this.model,pos);
		},
		
		mouseleave: function(e){
			app.EventAgg.trigger('hide_menu_delay');
		},
		
		mouseDown: function(e) {
			
			var connectionMode = this.model.get("connectionReady");
			app.EventAgg.trigger('hide_menu_now');
			if ( connectionMode == true ) { 
				if ( app.pendingConnection != undefined ) { 
					app.pendingConnection.set("target",this.model);
					var status = app.DiagramVerifier.is_valid_connection(app.pendingConnection);
					if ( status.valid ){
						app.EventAgg.trigger('connection_mode_deactivated');
						app.ActiveDiagram.add_connection(app.pendingConnection);
					}else {
						var info_msg_model = new app.InformationMessage({message:status.message, type:'error',title:'Error: '});
						app.EventAgg.trigger('wrong_connection_created',{info_msg: info_msg_model});
						app.pendingConnection.destroy();
					}
					
					this.model.set('connectionReady',false);
					app.pendingConnection = undefined;

				}
			}
		}
		
	});
	
});
define(['models/globals','views/globals','controllers/DiagramVerifier','Backbone','views/DiagramConnectionView'],
		function(model_globals,view_globals,DiagramVerifier,Backbone,DiagramConnectionView) {
	var DiagramElementView = Backbone.View.extend({
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
				  label: this.model.get('name').slice(0,view_globals.LENGTH_DIAGRAM_TITLE),
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
//			this.listenTo(this.model,'change',this.refresh_attributes);
			this.listenTo(this.model,"change:name",this.model_changed);
			this.listenTo(this.model.get('attributes'),"change",this.refresh_attributes);
			this.listenTo(this.model, 'destroy',this.destroyElement);
			_.bindAll(this, "toggleHighlight");
			view_globals.event_agg.bind("toggleDeleteMode",this.toggleDeleteMode);
			view_globals.event_agg.bind('editDiagramElement',this.toggleHighlight);
			var context = this;
			jointObj.registerCallback('elementMoved',function(new_loc){
				context.model.set('x',new_loc.x);
				context.model.set('y',new_loc.y);
				context.model.save();
			});
			this.model_changed();
			this.refresh_attributes();
			
			var subdiagram = this.model.get('subdiagram');
			this.listenTo(subdiagram,'add:elements',this.show_subdiagram_icon);
			this.listenTo(subdiagram,'remove:elements',this.hide_subdiagram_icon);
		},
		
		show_subdiagram_icon:function() {
			var joint = this.model.get('jointObj');
			joint.set_has_subdiagram(true);
			joint.zoom();
		},
		
		hide_subdiagram_icon:function() {
			var subdiagram = this.model.get('subdiagram');
			if (subdiagram.get('elements').length > 0 )
				return;
			var joint = this.model.get('jointObj');
			joint.set_has_subdiagram(false);
			joint.zoom();
		},
		
		destroyElement:function() {
			console.log("DESTROYING ELEMENT");
			var jointObj = this.model.get('jointObj');
			for (var i=0; i<jointObj.inner.length; ++i) {
				jointObj.inner[i].remove();
			}
			jointObj.shadow.remove();
			jointObj.liquidate();
			this.stopListening();
			view_globals.event_agg.off('editDiagramElement', this.toggleHighlight);
			this.remove();
		},
			
		//Toggles the highlighting of an element upon clicking on it.
		toggleHighlight: function(element){ 
			if ( this.model.get('diagram') != model_globals.ActiveDiagram ) {
				return;
			}
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
			jointObj.properties.label = this.model.get('name').slice(0,view_globals.LENGTH_DIAGRAM_TITLE);
			jointObj.zoom();
		},
		
		refresh_attributes: function() {
			console.log("Refreshing attributes");
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
			
			for (var i=0; i<Math.min(view_globals.ATTR_IN_DIAGRAM_VIEW,attributes.length); ++i) {
				var actual_value = attributes[i].get('value')
				var value_attr = actual_value.length>9?actual_value.substr(0,9)+'...':actual_value;
				jointObj.properties.actions.inner.unshift(value_attr);
				jointObj.properties.actions.inner.unshift(attributes[i].get("key"));
			}
			jointObj.zoom();
		},
		
		which_menu_items: function() {
			//Not allowing more than one outgoing connection:
			var source_connection = this.model.get('connections');
			if ( this.model.get('type') != 'task_operation' && this.model.get('type') != 'logic' && source_connection.size() > 0 ) {
				return ['#btn_connect'];
			}else { 
				return undefined;
			}

		},
		
		trigger_menu: function() {
			var which_menu_items = this.which_menu_items();
			var options = {
					items_to_hide: which_menu_items
			};
			var pos = this.$el.offset();
			pos.left -= $(window).scrollLeft();
			pos.left -= $(window).scrollTop();
			view_globals.event_agg.trigger('show_menu_delay',this.model,pos,options);
			
		},
		
		mouseUp: function(e) { 
			this.trigger_menu();
			view_globals.event_agg.trigger('editDiagramElement',this.model);
		},
		
		mouseenter: function(e) {
			if ( e.which != 0 ) return;
			this.trigger_menu();
		},
		
		mouseleave: function(e){
			view_globals.event_agg.trigger('hide_menu_delay');
		},
		
		mouseDown: function(e) {
			
			var connectionMode = this.model.get("connectionReady");
			view_globals.event_agg.trigger('hide_menu_now');
			if ( connectionMode == true ) { 
//				if ( model_globals.pendingConnection != undefined ) { 
//					model_globals.pendingConnection.set("target",this.model);
//					var status = DiagramVerifier.is_valid_connection(model_globalspendingConnection);
//					if ( status.valid ){
//						view_globals.event_agg.trigger('connection_mode_deactivated');
//						model_globals.ActiveDiagram.add_connection(model_globals.pendingConnection);
//					}else {
//						view_globals.event_agg.trigger('wrong_connection_created',{info_msg: {message:status.message, type:'error',title:'Error: '}});
//						model_globals.pendingConnection.destroy();
//					}
//					
//					this.model.set('connectionReady',false);
//					model_globals.pendingConnection = undefined;
//
//				}
				var connection = this.model.connect_element();
				new DiagramConnectionView({model:connection});
				view_globals.event_agg.trigger('connection_mode_deactivated');
				this.model.set('connectionReady',false);

				
			}
		}
		
	});
	
	return DiagramElementView;
});
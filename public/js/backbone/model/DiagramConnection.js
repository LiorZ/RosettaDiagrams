define(['Backbone','BackboneRelational','models/globals','models/DiagramLink'],function(Backbone,BackboneRelational,globals,DiagramLink) {
	var DiagramConnection = DiagramLink.extend({
		defaults:{
			type:'connection'
		},
		initialize:function(options) {
//			if ( options.source ) {
//				this.listenTo(options.source,'destroy',this.destroy);
//			}
//			if ( options.target ) {
//				this.listenTo(options.target,'destroy',this.destroy);
//			}
//			console.log("CREATING CONNECTION");
			this.listenTo(this,'change:source',this.set_new_source);
			this.listenTo(this,'change:target',this.set_new_target);

		},
	
		set_new_element:function(new_element,which) {
			var prev_elem = this.previous(which);
			if ( !_.isUndefined(prev_elem) ){
				this.stopListening(prev_elem);
			}
			if ( !_.isUndefined(new_element) && !_.isNull(new_element) )
				this.listenTo(new_element,'destroy',this.destroy);
		},
		
		set_new_source: function(model,value,options){
			this.set_new_element(value,'source');
		},
		
		set_new_target:function(model,value,options) {
			this.set_new_element(value,'target');
		},
		
	});
	
	globals.DiagramConnection = DiagramConnection;
	
	return DiagramConnection;
});

//(function() {
//	
//	'use strict';
//
//	app.DiagramConnection = Backbone.Model.extend({
//		
//		defaults: {
//			source: undefined,
//			target: undefined,
//			type: undefined,
//			jointObj: undefined,
//			label:""
//		},
//		
//		initialize:function(options) {
//			if ( options.source ) {
//				this.setSourceObj(this,options.source);
//			}
//			if ( options.target ) {
//				this.setTargetObj(this,options.target);
//			}
//			this.listenTo(this,'change:source',this.setSourceObj);
//			this.listenTo(this,'change:target',this.setTargetObj);
//			
//		},
//		
//		destroy: function(options) {
//			var source = this.get('source');
//			if ( source != undefined ) {
//				source.unset('target_node');
//			}
//			Backbone.Model.prototype.destroy.call(this);
//		},
//		
//		setSourceObj:function(model,obj) {
//			var target = this.get('target');
//			console.log("Changing source");
//			if ( ! _.isUndefined(target) ) {
//				obj.set('target_node', target);
//			}
//		},
//		
//		setTargetObj:function(model,obj) {
//			var source = this.get('source');
//			console.log("Changing target");
//			if ( source ) {
//				var prev_target = source.get('target_node');
//				if ( !_.isUndefined(prev_target) ) {
//					console.log("Stopping listening to prev target");
//					this.stopListening(prev_target);
//				}
//				this.listenTo(obj,'destroy',function(o) { console.log("GOT IT!"); source.unset('target_node'); });
//				source.set('target_node',obj);
//			}
//		},
//		
//		changeConnectedElement: function(side,rawElement) { 
//			
//			var foundElement = undefined;
//			var elements = app.ActiveDiagram.get('elements');
//			if ( elements == undefined || elements.length == 0) {
//				alert("ERROR: No elements in canvas");
//				return undefined;
//			}
//			elements.each(
//					function(element) {
//						var jointObj = element.get('jointObj');  
//						if ( jointObj == rawElement ) {
//							foundElement = element; 
//						}
//					}
//			);
//			
//			if ( foundElement == undefined ) {
//				alert("Error / Bug: can't find the element in the model");
//				return;
//			}
//			if ( side == "end" ) {
//				console.log("Setting target element to be " + foundElement.get('attributes').byKey('name').get('value'));
//				this.set("target",foundElement);
//			}else { 
//				this.set("source",foundElement);
//			}
//		}
//		
//	});
//	
//	app.pendingConnection = undefined;
//	
//}());
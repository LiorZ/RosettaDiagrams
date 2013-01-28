var app = app || {};
$(function() {
	
	app.DiagramConnectionView = Backbone.View.extend({
		
		initialize: function() {
			var model = this.model;
			var source = model.get('source');
			var target =  model.get('target')
			var target_joint = target.get('jointObj');
			var jointObj = source.get('jointObj').joint(target_joint,Joint.dia.uml);
			
			model.set('jointObj',jointObj);
			
			var obj = this;
			jointObj.registerCallback("justConnected",function(side) {
				var rawElement = this.wholeShape;
				obj.changeConnectedElement(side,rawElement);
			});
			this.listenTo(source,'destroy',this.delete_connection);
			this.listenTo(target,'destroy',this.delete_connection);
		},
	
		changeConnectedElement: function(side,rawElement) { 
			var foundElement = undefined;
			app.Elements.each(
					function(element) {
						var jointObj = element.get('jointObj');  
						if ( jointObj == rawElement ) {
							console.log("Element connection is changed to "+element);
							foundElement = element; 
						}
					}
			);
			if ( side == "end" ) {
				this.model.set("target",foundElement);
			}else { 
				this.model.set("source",foundElement);
			}
			
			var source = this.model.get('source');
			var target = this.model.get('target');
			//reset the listeners:
			this.stopListening(source);
			this.stopListening(target);
			
			this.listenTo(source,'destroy',this.delete_connection);
			this.listenTo(target,'destroy',this.delete_connection);
		},
		
		delete_connection:function() {
			
			this.model.destroy();
			this.stopListening();
			this.remove();
		}
		
	});
	
});
(function() {
	
	'use strict';

	app.DiagramConnection = Backbone.Model.extend({
		
		defaults: {
			source: undefined,
			target: undefined,
			type: undefined,
			jointObj: undefined
		},
		changeConnectedElement: function(side,rawElement) { 
			
			console.log("Just connected ... ");
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
			
			if ( foundElement == undefined ) {
				alert("Error / Bug: can't find the element in the model");
				return;
			}
			if ( side == "end" ) {
				this.set("target",foundElement);
			}else { 
				this.set("source",foundElement);
			}
			
			var source = this.get('source');
			var target = this.get('target');
			//reset the listeners:
			this.stopListening(source);
			this.stopListening(target);
			
			this.listenTo(source,'destroy',this.delete_connection);
			this.listenTo(target,'destroy',this.delete_connection);
		},
		
	});
	
	app.pendingConnection = undefined;
	
}());
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
			app.ActiveDiagram.each(
					function(element) {
						var jointObj = element.get('jointObj');  
						if ( jointObj == rawElement ) {
							foundElement = element; 
						}
					}
			);
			
			if ( foundElement == undefined ) {
				alert("Error / Bug: can't find the element in the model");
				return;
			}
			if ( side == "end" ) {
				console.log("Setting target element to be " + foundElement.get('attributes').byKey('name').get('value'));
				this.set("target",foundElement);
			}else { 
				this.set("source",foundElement);
			}
		},
		
	});
	
	app.pendingConnection = undefined;
	
}());
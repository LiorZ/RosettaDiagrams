(function() {
	
	'use strict';

	app.DiagramConnection = Backbone.Model.extend({
		
		defaults: {
			source: undefined,
			target: undefined,
			type: undefined,
			jointObj: undefined,
			label:""
		},
		changeConnectedElement: function(side,rawElement) { 
			
			var foundElement = undefined;
			var elements = app.ActiveDiagram.get('elements');
			if ( elements == undefined || elements.length == 0) {
				alert("ERROR: No elements in canvas");
				return undefined;
			}
			elements.each(
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
		}
		
	});
	
	app.pendingConnection = undefined;
	
}());
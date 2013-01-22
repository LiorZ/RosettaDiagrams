var app = app || {};
$(function() {
	
	app.DiagramConnectionView = Backbone.View.extend({
		
		initialize: function() {
			var model = this.model;
			var source = model.get('source');
			var target =  model.get('target').get('jointObj');
			var jointObj = source.get('jointObj').joint(target,Joint.dia.uml);
			
			model.set('jointObj',jointObj);
			
			var obj = this;
			jointObj.registerCallback("justConnected",function(side) {
				var rawElement = this.wholeShape;
				obj.changeConnectedElement(side,rawElement);
			});
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
		}
		
	});
	
});
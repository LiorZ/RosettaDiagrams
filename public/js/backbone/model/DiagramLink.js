define(['Backbone','BackboneRelational','models/globals'],function(Backbone,R,model_globals) {
	var DiagramLink =  Backbone.RelationalModel.extend({
		idAttribute: "_id",
		subModelTypes:{
			'connection':'DiagramConnection',
			'containment':'DiagramContainment'
		},
		url:function() {
			if ( this.isNew() ) {
				return '/connection/new';
			}else {
				return '/connection/id/' + this.id;
			}
		},
				changeConnectedElement: function(side,rawElement) { 
					
					var foundElement = undefined;
					var elements = model_globals.ActiveDiagram.get('elements');
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
				},
				
			toJSON: function(options) {
				var json = Backbone.RelationalModel.prototype.toJSON.apply(this, [options]);
				return _.omit(json,['jointObj']);
			} 
	});
	
	model_globals.DiagramLink = DiagramLink;
	
	return DiagramLink;
})
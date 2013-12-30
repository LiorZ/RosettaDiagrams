define(['Backbone','BackboneRelational','models/globals'],function(Backbone,R,model_globals) {
	var DiagramLink =  Backbone.RelationalModel.extend({
		idAttribute: "_id",
		subModelTypes:{
			'connection':'DiagramConnection',
			'containment':'DiagramContainment'
		},
		relations: [
					{
						type: Backbone.HasOne,
						key: 'source',
						relatedModel: 'DiagramElement',
						includeInJSON:'id'
					},
					{
						type: Backbone.HasOne,
						key: 'target',
						relatedModel: 'DiagramElement',
						includeInJSON:'id',
						reverseRelation: {
							key:'pointed_by',
							includeInJSON: false,
						}
					}
				],
				
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
				}
	});
	
	model_globals.DiagramLink = DiagramLink;
	
	return DiagramLink;
})
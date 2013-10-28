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
				]
	});
	
	model_globals.DiagramLink = DiagramLink;
	
	return DiagramLink;
})
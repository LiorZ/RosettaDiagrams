define(['Backbone','models/globals'],function(Backbone,model_globals) {
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
						includeInJSON:'id'
					}
				]
	});
	
	model_globals.DiagramLink = DiagramLink;
	
	return DiagramLink;
})
define(['Backbone','BackboneRelational','models/globals'],function(Backbone,BackboneRelational,globals) {
	var BaseAttribute = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		subModelTypes:{
			'regular':'Attribute',
			'task_operation':'TaskOAttribute'
		},
		defaults: { 
			key: 'key',
			value:'val'
		},
		url: function() {
			var element = this.get('element');
			var element_id = element.id;
			var diagram_id = element.get('diagram').id;
			if ( this.isNew() ) {
				return "/diagram/" + diagram_id + "/element/" + element_id + "/attribute/new";
			}else {
				"/diagram/" + diagram_id + "/element/" + element_id + "/attribute/" + this.id;
			}
		}
	});
	
	
	globals.BaseAttribute = BaseAttribute;
	
	return BaseAttribute;
});
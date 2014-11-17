define(['Backbone','BackboneRelational','models/globals'],function(Backbone,BackboneRelational,globals) {
	var BaseAttribute = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		url: function(){
			if ( this.isNew() ) {
				return "/attribute/new";
			}else { 
				return "/attribute/id/" + this.id;
			}
		},
		subModelTypes:{
			'regular':'Attribute',
			'task_operation':'TaskOAttribute'
		},
		defaults: { 
			key: 'key',
			value:'val'
		},
		initialize:function(options) {
			this.listenTo(this,'change:key change:value',this.save_model);
		},
		save_model:function() {
			this.save();
		}
	});
	
	globals.BaseAttribute = BaseAttribute;
	
	return BaseAttribute;
});
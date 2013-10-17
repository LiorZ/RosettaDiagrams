define(['Backbone','BackboneRelational','models/globals'],function(Backbone,BackboneRelational,globals) {
	var Attribute = Backbone.RelationalModel.extend({
		idAttribute: "_id",
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
	
	
	globals.Attribute = Attribute;
	
	return Attribute;
});

//var app = app || {};
//(function() {
//		
//	'use strict';
//
//	app.Attribute = Backbone.Model.extend({
//		
//		defaults: { 
//			key: 'key',
//			value:'val'
//		}
//		
//	});
//	
//
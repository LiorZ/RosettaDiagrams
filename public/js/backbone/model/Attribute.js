define(['Backbone','BackboneRelational','models/globals','models/BaseAttribute'],function(Backbone,BackboneRelational,globals,BaseAttribute) {
	var Attribute = BaseAttribute.extend({
		defaults:{
			type:'regular'
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
define(['Backbone','BackboneRelational','models/globals'],function(Backbone,BackboneRelational,globals) {
	var Attribute = Backbone.RelationalModel.extend({
		defaults: { 
			key: 'key',
			value:'val'
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
//	app.AttributeList = Backbone.Collection.extend({
//		model: app.Attribute,
//		byKey: function(key) {
//		    var filtered = this.filter(function(attr) {
//		      return attr.get("key") == key;
//		    });
//		    return filtered[0];
//		},
//		nonEmpty: function() {
//			return this.filter(function(attr) {
//				return attr.get('value') !='';
//			});
//		}
//	});
//}
//());
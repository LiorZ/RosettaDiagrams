var app = app || {};
(function() {
		
	'use strict';

	app.Attribute = Backbone.Model.extend({
		
		defaults: { 
			key: 'key',
			value:'val',
		}
		
	});
	
	
	app.AttributeList = Backbone.Collection.extend({
		model: app.Attribute
	});
}
());
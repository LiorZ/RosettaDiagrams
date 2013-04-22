(function() {
	
	'use strict';

	app.InformationMessage = Backbone.Model.extend({
		
		defaults: {
			title:'',
			message:'',
			type:'information'
		}
		
	});
	
}());
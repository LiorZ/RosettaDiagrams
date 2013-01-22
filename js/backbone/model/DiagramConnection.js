(function() {
	
	'use strict';

	app.DiagramConnection = Backbone.Model.extend({
		
		defaults: {
			source: undefined,
			target: undefined,
			type: undefined,
			jointObj: undefined
		},
		
	});
	
	app.pendingConnection = undefined;
	
	/*Flow of creating a connection:
	1)Click on a 'create connection' button turns on a flag on all DiagramElement models to wait for a connection.
	2)Click on a DiagramElement creates a connection object (temp/adds to a collection?) and assign the source element to it.
	3)Click on another DiagramElement sets the target element:
		3.1)Checks if the source element is already set. If it is , set the target element.
	4)Once the target element is set , the collection listens to this event and adds it to the collection.
	5)The ConnectionView also listens to the target-set event and shows the connection.
	*/
	
}());
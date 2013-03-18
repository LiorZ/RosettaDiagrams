(function() {
	
	'use strict';
	consts.DIAGRAM_ELEMENT_DEFAULT_WIDTH = 150;
	consts.DIAGRAM_ELEMENT_DEFAULT_HEIGHT = 100;

	app.DiagramContainer = app.DiagramElement.extend({
		initialize:function(options) {
	   	      this.constructor.__super__.initialize.apply(this, [options]);
	   	      this.set('width',consts.DIAGRAM_CONTAINER_DEFAULT_WIDTH);
	   	      this.set('height',consts.DIAGRAM_CONTAINER_DEFAULT_HEIGHT);
		},
	});
	
}());

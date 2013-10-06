var app = app || {};
$(function() {
	
	app.DiagramContainerView = app.DiagramElementView.extend({
		initialize: function(options) {
	   	      this.constructor.__super__.initialize.apply(this, [options]);
	   	      var jointObj = this.model.get('jointObj');
		},
		
	})
	
});
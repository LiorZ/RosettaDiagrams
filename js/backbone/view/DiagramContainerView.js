var app = app || {};
$(function() {
	
	app.DiagramContainerView = app.DiagramElementView.extend({
		initialize: function(options) {
	   	      this.constructor.__super__.initialize.apply(this, [options]);
	   	      var jointObj = this.model.get('jointObj');
	   	      jointObj.registerCallback('elementEmbedded',function(element){
					var model_element = app.Elements.byJointObject(element.wrapper);
					if ( model_element ){
						model_element.trigger('embeddedInElement');
					}
	   	      });
	   	      
	   	   jointObj.registerCallback('elementUnEmbedded',function(element){
				var model_element = app.Elements.byJointObject(element.wrapper);
				if ( model_element ){
					model_element.trigger('embeddedUnElement');
				}
  	      });
		},
		
	})
	
});
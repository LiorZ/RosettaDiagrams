define(['models/globals','models/DiagramElement','Backbone'],function(model_globals,DiagramElement,Backbone){
	var PaletteEntryView = Backbone.View.extend({
		tagName:'button',
		className:'palette_button',
		events:{
			'click':'add_element'
		},
		initialize:function(options) {
			this.json_model = options.json_model 
			this.$el.text(this.json_model.name.slice(0,20));
			this.$el.css('display','block');
		},
		
		render: function() {
			return this.$el;
		},
		
		add_element:function() {
			model_globals.ActiveDiagram.add_element(this.json_model);
		}
	});
	
	return PaletteEntryView;
});
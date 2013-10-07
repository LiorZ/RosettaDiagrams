define(['models/globals','Backbone'],function(model_globals,Backbone){
	var PaletteEntryView = Backbone.View.extend({
		tagName:'button',
		className:'palette_button',
		events:{
			'click':'add_element'
		},
		initialize:function() {
			this.$el.text(this.model.get('name').slice(0,20));
			this.$el.css('display','block');
		},
		
		render: function() {
			return this.$el;
		},
		
		add_element:function() {
			var new_model = this.model.clone();
			var attr = this.model.get('attributes');
			new_model.set_name_attribute('element_'+model_globals.elementCounter++);
			new_model.add_attributes(attr.toJSON());
			model_globals.ActiveDiagram.add_element(new_model);
		}
	});
	
	return PaletteEntryView;
});

//var app = app || {};
//$(function() {
//	
//	app.PaletteEntryView = Backbone.View.extend({
//		tagName:'button',
//		className:'palette_button',
//		events:{
//			'click':'add_element'
//		},
//		initialize:function() {
//			this.$el.text(this.model.get('name').slice(0,20));
//			this.$el.css('display','block');
//		},
//		
//		render: function() {
//			return this.$el;
//		},
//		
//		add_element:function() {
//			var new_model = this.model.clone();
//			var attr = this.model.get('attributes');
//			new_model.set_name_attribute('element_'+app.elementCounter++);
//			new_model.add_attributes(attr.toJSON());
//			app.ActiveDiagram.add_element(new_model);
//		}
//	});
//});
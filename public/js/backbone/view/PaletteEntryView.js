define(['models/globals','models/DiagramElement','Backbone'],function(model_globals,DiagramElement,Backbone){
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
			var model_json = _.omit(this.model.toJSON(),'_id');
			console.log(model_json);
			var new_model = new DiagramElement(model_json);
//			new_model.add_attributes(attr.toJSON());
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
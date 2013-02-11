var app = app || {};
$(function() {
	
	app.PaletteEntryView = Backbone.View.extend({
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
			new_model.set_name_attribute('element_'+app.elementCounter++);
			new_model.add_attributes(attr.toJSON());
			app.Elements.add(new_model);
		}
	});
});
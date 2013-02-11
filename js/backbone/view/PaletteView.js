var app = app || {};
$(function() {
	
	app.PaletteView = Backbone.View.extend({
		el: '#menu',
		initialize:function() {

		},
		
		render: function() {
			var context = this;
			app.PaletteElements.each(function(elem){
				var p_entry = new app.PaletteEntryView({model: elem});
				var type_obj = app.Attributes[elem.get('type')];
				context.$(type_obj.palette_div).append(p_entry.render());
			});
		},
		
	});
});
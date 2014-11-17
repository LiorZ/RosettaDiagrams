define(['views/PaletteEntryView','views/globals','Backbone'],function(PaletteEntryView,view_globals,Backbone) {
	var PaletteView = Backbone.View.extend({
		el: '#menu',
		json_models:undefined,
		initialize:function(options) {
			this.json_models = options.json_models
		},
		render: function() {
			var context = this;
			_.each(this.json_models,function(elem) {
				var p_entry = new PaletteEntryView({json_model: elem});
				var type_obj = view_globals.Attributes[elem.type];
				context.$(type_obj.palette_div).append(p_entry.render());
			});
		}
		
	});
	
	return PaletteView;
});

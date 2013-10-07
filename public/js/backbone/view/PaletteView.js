define(['views/PaletteEntryView','views/globals','Backbone'],function(PaletteEntryView,view_globals,Backbone) {
	var PaletteView = Backbone.View.extend({
		el: '#menu',
		
		render: function() {
			var context = this;
			this.model.each(function(elem){
				var p_entry = new PaletteEntryView({model: elem});
				var type_obj = view_globals.Attributes[elem.get('type')];
				context.$(type_obj.palette_div).append(p_entry.render());
			});
			
		}
		
	});
	
	return PaletteView;
});
//
//var app = app || {};
//$(function() {
//	
//	app.PaletteView = Backbone.View.extend({
//		el: '#menu',
//		
//		render: function() {
//			var context = this;
//			this.model.each(function(elem){
//				var p_entry = new PaletteEntryView({model: elem});
//				var type_obj = view_globals.Attributes[elem.get('type')];
//				context.$(type_obj.palette_div).append(p_entry.render());
//			});
//			
//		}
//		
//	});
//});
app = app || {};

$(function() {

	app.PaletteElements.fetch({update: true, success:function() {
		app.PaletteElements.sort();
		//Disabling any server support of backbonejs (maybe returns in the future)
		
		Backbone.sync = function(method, model, options) { };
		
		new app.AppView().render();
	}}); //update:true to get 'add' event to run

});

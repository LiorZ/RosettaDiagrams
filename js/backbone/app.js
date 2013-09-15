app = app || {};

$(function() {

	app.PaletteElements.fetch({update: true, success:function() {
		app.PaletteElements.sort();
		new app.AppView().render();
	}}); //update:true to get 'add' event to run

});

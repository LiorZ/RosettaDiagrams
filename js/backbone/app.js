app = app || {};

$(function() {


	app.PaletteElements.fetch({update: true, success:function() {
		new app.AppView().render();
	}}); //update:true to get 'add' event to run

});

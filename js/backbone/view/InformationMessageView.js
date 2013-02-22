var app = app || {};
$(function() {
	
	app.InformationMessageView = Backbone.View.extend({
		
		el:'#information_panel_wrapper',
		template: undefined,
		initialize:function() {
			this.template = _.template( $('#information_message_template').html() );
		},
		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) );
			this.$el.css('display','inline');
			var cntx = this;
			setTimeout(function(){
				
				cntx.$el.effect("fade",{}, 500 ); },
				4000);
			
			//function() {cntx.$el.html(''); cntx.$el.removeAttr( "style" ).hide().fadeIn();}
		},
	});
});
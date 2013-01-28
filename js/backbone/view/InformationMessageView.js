var app = app || {};
$(function() {
	
	app.InformationMessageView = Backbone.View.extend({
		
		el:'#information_message',
		template: undefined,
		initialize:function() {
			this.template = _.template( $('#information_message_template').html() );
		},
		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) );
			this.$el.css('display','inline');
			return this;
		},
	});
});
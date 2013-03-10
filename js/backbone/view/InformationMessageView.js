var app = app || {};
$(function() {
	
	app.InformationMessageView = Backbone.View.extend({
		
		el:'#information_panel_wrapper',
		template: undefined,
		initialize:function() {
			this.template = _.template( $('#information_message_template').html() );
			this.listenTo(app.EventAgg,'connection_mode_activated',this.show_message);
			this.listenTo(app.Connections,'add',this.hide_message);
			this.listenTo(app.EventAgg,'connection_mode_ended',this.hide_message);
			this.listenTo(app.EventAgg,'wrong_connection_created',this.show_message)
		},
		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) );
			this.$el.fadeIn(500)
			var context = this;
			setTimeout(function() {context.hide_message()},3000);
		},
		
		hide_message:function() {
			this.$el.fadeOut(500);
		},
		
		show_message:function(options) {
			var info_msg = options.info_msg;
			this.model = info_msg;
			this.render();
		}
	});
});
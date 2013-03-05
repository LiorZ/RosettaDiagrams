var app = app || {};
$(function() {
	
	app.InformationMessageView = Backbone.View.extend({
		
		el:'#information_panel_wrapper',
		template: undefined,
		initialize:function() {
			this.template = _.template( $('#information_message_template').html() );
			this.listenTo(app.EventAgg,'connection_mode_activated',this.handle_connection_mode_activation);
			this.listenTo(app.Connections,'add',this.handle_connection_mode_ended);
			this.listenTo(app.EventAgg,'connection_mode_ended',this.handle_connection_mode_ended);
		},
		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) );
			this.$el.fadeIn(500);
		},
		
		handle_connection_mode_ended:function() {
			this.$el.fadeOut(500);
		},
		
		handle_connection_mode_activation:function(options) {
			var info_msg = options.info_msg;
			this.model = info_msg;
			this.render();
		}
	});
});
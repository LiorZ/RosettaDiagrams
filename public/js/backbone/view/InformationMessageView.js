define(['Backbone','views/globals','models/globals'],function(Backbone,view_globals,model_globals) {
	var InformationMessageView = Backbone.View.extend({
		
		el:'#information_panel_wrapper',
		template: undefined,
		initialize:function() {
			this.template = _.template( $('#information_message_template').html() );
			this.listenTo(view_globals.event_agg,'connection_mode_activated',this.show_message);
			this.listenTo(model_globals.MainDiagram,'add:connection',this.hide_message);
			this.listenTo(view_globals.event_agg,'connection_mode_ended',this.hide_message);
			this.listenTo(view_globals.event_agg,'wrong_connection_created',this.show_message)
		},
		render: function() {
			this.$el.html( this.msg );
			this.$el.fadeIn(500)
			var context = this;
			setTimeout(function() {context.hide_message()},3000);
		},
		
		hide_message:function() {
			this.$el.fadeOut(500);
		},
		
		show_message:function(options) {
			var info_msg = options.info_msg;
			this.msg = info_msg;
			this.render();
		}
	});
	
	return InformationMessageView;
});

//var app = app || {};
//$(function() {
//	
//	app.InformationMessageView = Backbone.View.extend({
//		
//		el:'#information_panel_wrapper',
//		template: undefined,
//		initialize:function() {
//			this.template = _.template( $('#information_message_template').html() );
//			this.listenTo(app.EventAgg,'connection_mode_activated',this.show_message);
//			this.listenTo(app.MainDiagram,'add:connection',this.hide_message);
//			this.listenTo(app.EventAgg,'connection_mode_ended',this.hide_message);
//			this.listenTo(app.EventAgg,'wrong_connection_created',this.show_message)
//		},
//		render: function() {
//			this.$el.html( this.msg );
//			this.$el.fadeIn(500)
//			var context = this;
//			setTimeout(function() {context.hide_message()},3000);
//		},
//		
//		hide_message:function() {
//			this.$el.fadeOut(500);
//		},
//		
//		show_message:function(options) {
//			var info_msg = options.info_msg;
//			this.msg = info_msg;
//			this.render();
//		}
//	});
//});
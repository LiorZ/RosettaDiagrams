define(['Backbone','views/XMLProtocolView'],function(Backbone,XMLProtocolView) {
	var XMLProtocolView = Backbone.View.extend({
		
		tagName: 'pre',
		template: undefined,
		initialize: function() { 
			var typeObj = this.model.get('typeObj');
			this.template = _.template( $('#protocols_template').html() );
		},
		
		render: function() { 
			
			this.$el.html( this.template( this.model.toJSON() ) );
			return this;
		}
	});
	
	return XMLProtocolView;
})
//
//var app = app || {};
//$(function() {
//	
//	app.XMLProtocolView = Backbone.View.extend({
//		
//		tagName: 'pre',
//		template: undefined,
//		initialize: function() { 
//			var typeObj = this.model.get('typeObj');
//			this.template = _.template( $('#protocols_template').html() );
//		},
//		
//		render: function() { 
//			
//			this.$el.html( this.template( this.model.toJSON() ) );
//			return this;
//		}
//	});
//});
define(['Backbone'],function(Backbone) {
	var XMLMoversView = Backbone.View.extend({
		
		tagName: 'pre',
		template: undefined,
		initialize: function() { 
			var typeObj = this.model.get('typeObj');
			this.template = _.template( $('#movers_template').html() );
		},
		
		render: function() { 
			
			this.$el.html( this.template( this.model.toJSON() ) );
			return this;
		}
	});
	
	return XMLMoversView
});


//var app = app || {};
//$(function() {
//	
//	app.XMLMoversView = Backbone.View.extend({
//		
//		tagName: 'pre',
//		template: undefined,
//		initialize: function() { 
//			var typeObj = this.model.get('typeObj');
//			this.template = _.template( $('#movers_template').html() );
//		},
//		
//		render: function() { 
//			
//			this.$el.html( this.template( this.model.toJSON() ) );
//			return this;
//		}
//	});
//});
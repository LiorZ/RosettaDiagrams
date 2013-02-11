var app = app || {};
$(function() {
	
	app.AttributeView = Backbone.View.extend({
		
		tagName: 'tr',
		template: undefined,
		
		events: {
			"focusout #attr_key" : "update_model",
			"focusout #attr_value" : "update_model",
			"keypress #attr_key": "update_model_keypressed",
			"keypress #attr_value": "update_model_keypressed",
			"click #deleteBtn": "destroy_attribute"
		},
		
		initialize: function() { 
			this.template = _.template( $('#attribute_template').html() );
		},
		
		destroy_attribute: function() { 
			this.model.destroy();
			this.remove();
		},
		
		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) );
			return this;
		},
		
		update_model:function() { 
			var key = this.$('#attr_key').val();
			var value = this.$('#attr_value').val();
			this.model.set('key',key);
			this.model.set('value',value);
		},
		
		update_model_keypressed: function(e) { 
			if ( e.which == ENTER_KEY ) {
				this.update_model();
			}
		}
	
	});
});
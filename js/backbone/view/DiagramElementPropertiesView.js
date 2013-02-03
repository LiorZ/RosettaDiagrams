var app = app || {};


$(function() {
	
	app.DiagramElementPropertiesView = Backbone.View.extend({
		el:'#mover_properties',
		eventagg: undefined,
		model:undefined,
		
		events: {
			'focusout #mover_name': 'set_mover_name',
			"click #add_attribute": "addAttribute",
		},
		initialize: function(options) {
				this.eventagg = options.eventagg;
				_.bindAll(this, "editDiagramElement");
				this.eventagg.bind('editDiagramElement',this.editDiagramElement);
				this.listenTo(app.Elements,'change',this.render);
				this.listenTo(app.Connections,'change',this.render);
				this.model = options.model;
		},
		
		render: function() { 
			this.$('#attribute_list').empty();
			this.$("#mover_name").empty();
			if ( this.model == undefined )
				return;
			
			var name = this.model.get('name');
			this.$('#mover_name').val(name);
			this.$('#attribute_list').empty();
			var attributes = this.model.get('attributes');
			var prop = this;
			attributes.each( function(attr) {
				prop.createAttributeView(attr);
			});
		},
		
		editDiagramElement: function(element) {
			this.model = element;
			this.render();
		},
		
		addAttribute: function(){
			var attributes = this.model.get('attributes');
			var new_attribute = new app.Attribute();
			attributes.add(new_attribute);
			this.createAttributeView(new_attribute);

		},
		
		createAttributeView: function(new_attribute) {
			var attr_view = new app.AttributeView({model:new_attribute });
			var element = attr_view.render().el;
			this.$('#attribute_list').append(element);
		},
		
		set_mover_name: function() { 
			var name = this.$('#mover_name').val();
			this.model.set('name',name);
		}
	});
	
});
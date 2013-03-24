var app = app || {};
$(function() {
	
	app.SubdiagramView = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			this.$el.css({display:'none'});
			var canvas = $('<div id="subdiagram"></div>').css({width:650,height:700});
			canvas.appendTo(this.$el);
			this.$el.appendTo('#workspace_container');
			this.jointObj = Joint.paper(canvas.get(0),650,700);
			var subdiagram = this.model.get('subdiagram');
			subdiagram.set('jointObj',this.jointObj);
			app.EventAgg.trigger('switch_diagram',subdiagram);
		},
		
		render: function() { 
			this.$el.dialog({
				height:800, 
				width:700,
				title:this.model.get('name') + " Subdiagram",
				close: function() {
					app.EventAgg.trigger('editDiagramElement',undefined);
					app.EventAgg.trigger('switch_diagram',app.MainDiagram);
				}
			} );
			
			this.render_elements();
		},
		
		render_elements: function() {
			var model = this.model.get('subdiagram');
			if ( model == undefined )
				return;
			var connections = model.get('connections');
			var elements = model.get('elements');
			if ( elements == undefined || elements.length == 0 )
				return;
			
			elements.each(
					function( element ) {
						var element_view = new app.DiagramElementView({model:element});
			});
			
			connections.each(
					function(con) { 
						var connection_view = new app.DiagramConnectionView({model:con});
			});
			
		}
	});
});
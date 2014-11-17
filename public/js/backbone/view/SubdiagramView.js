define(['views/globals','models/globals','views/DiagramElementView','views/DiagramConnectionView','Backbone'], 
		function(view_globals,model_globals,DiagramElementView,DiagramConnectionView,Backbone) {
	var SubdiagramView = Backbone.View.extend({
		tagName: 'div',
		initialize: function() {
			this.$el.css({display:'none'});
			var canvas = $('<div id="subdiagram"></div>').css({width:650,height:700});
			canvas.appendTo(this.$el);
			this.$el.appendTo('#workspace_container');
			this.jointObj = Joint.paper(canvas.get(0),650,700);
			var subdiagram = this.model.get('subdiagram');
			subdiagram.set('jointObj',this.jointObj);
			view_globals.event_agg.trigger('switch_diagram',subdiagram);
		},
		
		render: function() { 
			this.$el.dialog({
				height:800, 
				width:700,
				title:this.model.get('name') + " Subdiagram",
				close: function() {
					view_globals.event_agg.trigger('editDiagramElement',undefined);
					view_globals.event_agg.trigger('switch_diagram',model_globals.MainDiagram);
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
						console.log(element);
						var element_view = new DiagramElementView({model:element});
			});
			
			connections.each(
					function(con) { 
						var connection_view = new DiagramConnectionView({model:con});
			});
			
		}
	});
	
	return SubdiagramView;
});
//
//var app = app || {};
//$(function() {
//	
//	app.SubdiagramView = Backbone.View.extend({
//		tagName: 'div',
//		initialize: function() {
//			this.$el.css({display:'none'});
//			var canvas = $('<div id="subdiagram"></div>').css({width:650,height:700});
//			canvas.appendTo(this.$el);
//			this.$el.appendTo('#workspace_container');
//			this.jointObj = Joint.paper(canvas.get(0),650,700);
//			var subdiagram = this.model.get('subdiagram');
//			subdiagram.set('jointObj',this.jointObj);
//			app.EventAgg.trigger('switch_diagram',subdiagram);
//		},
//		
//		render: function() { 
//			this.$el.dialog({
//				height:800, 
//				width:700,
//				title:this.model.get('name') + " Subdiagram",
//				close: function() {
//					app.EventAgg.trigger('editDiagramElement',undefined);
//					app.EventAgg.trigger('switch_diagram',app.MainDiagram);
//				}
//			} );
//			
//			this.render_elements();
//		},
//		
//		render_elements: function() {
//			var model = this.model.get('subdiagram');
//			if ( model == undefined )
//				return;
//			var connections = model.get('connections');
//			var elements = model.get('elements');
//			if ( elements == undefined || elements.length == 0 )
//				return;
//			
//			elements.each(
//					function( element ) {
//						console.log(element);
//						var element_view = new app.DiagramElementView({model:element});
//			});
//			
//			connections.each(
//					function(con) { 
//						var connection_view = new app.DiagramConnectionView({model:con});
//			});
//			
//		}
//	});
//});
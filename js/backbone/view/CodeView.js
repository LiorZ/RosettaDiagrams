var app = app || {};
$(function() {
	
	app.CodeView = Backbone.View.extend({
		el:'#code',
		
		initialize: function() {
			this.listenTo(app.MainDiagram,'change:element',this.render);
			this.listenTo(app.MainDiagram,'change:connection',this.render);
			this.listenTo(app.MainDiagram,'remove:element',this.render);
			this.listenTo(app.MainDiagram,'remove:connection',this.render);
			this.listenTo(app.MainDiagram,'add:element',this.render);
			this.listenTo(app.MainDiagram,'add:element',this.attach_to_attributes);
			this.listenTo(app.MainDiagram,'add:connection',this.render);
		},
		
		attach_to_attributes:function(elem) {
			var attrs = elem.get('attributes');
			this.listenTo(attrs,'change add remove',this.render);
		},
		
		render: function() { 
			this.$('#xml_movers').empty();
			this.$('#xml_filters').empty();
			this.$('#xml_task_operations').empty();
			var mainElements = app.MainDiagram.get('elements');
			mainElements.each( function(element) {
				var htmlCode = element.get_declaration_string();
				var typeObj = element.get('typeObj');
				this.$(typeObj.codeTemplate).append(htmlCode);
			});
			
			this.renderConnections();

			var xml = vkbeautify.xml(this.$el.text());
			$('#display_code').text(xml);
			prettyPrint();
		},
		
		renderConnections: function() {
			this.$('#xml_protocols').empty();
			var has_linear = app.DiagramVerifier.has_linear_path();
			if ( !has_linear ) {
				return;
			}
			
			var all_sources = app.DiagramVerifier.get_sources();
			if ( _.isUndefined(all_sources) || all_sources.length == 0 ) {
				return;
			}
			
			var order = all_sources[0];
			do {
				var htmlCode = order.get_protocols_string();
				this.$('#xml_protocols').append(htmlCode);
				order = order.get('target_node');
			} while(order != undefined);
		}
		
	});
});
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
			this.listenTo(app.MainDiagram,'add:connection',this.render);
		},
		
		render: function() { 
			this.$('#xml_movers').empty();
			this.$('#xml_filters').empty();
			this.$('#xml_task_operations').empty();
			var mainElements = app.MainDiagram.get('elements');
			mainElements.each( function(element) {
				var htmlCode = element.get_declaration_string();
				console.log(htmlCode);
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
			var order = app.MainDiagram.get_ordered_elements();
			for(var i=0; i<order.length; ++i){ 
				//var protocolView = new app.XMLProtocolView({model: order[i]});
				var htmlCode = order[i].get_protocols_string();
				this.$('#xml_protocols').append(htmlCode);
			}
		}
		
	});
});
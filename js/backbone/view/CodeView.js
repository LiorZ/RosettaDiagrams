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
			$("#btn_run_code").button({
				text:false,
				icons:{
					primary: 'ui-icon-play'
				}
			});
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
			var order = app.MainDiagram.get_ordered_elements();
			for(var i=0; i<order.length; ++i){ 
				var htmlCode = order[i].get_protocols_string();
				this.$('#xml_protocols').append(htmlCode);
			}
		}
		
	});
});
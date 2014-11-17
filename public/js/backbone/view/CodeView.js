define(['models/globals','controllers/DiagramVerifier','Backbone','vkbeautify'], function(model_globals,DiagramVerifier,Backbone,vkbeautify) {
	var CodeView = Backbone.View.extend({
		el:'#code',
		initialize: function() {
			this.listenTo(model_globals.MainDiagram.get('elements'),'change add remove',this.render);
//			this.listenTo(model_globals.MainDiagram,'change:connection',this.render);
//			this.listenTo(model_globals.MainDiagram,'remove:element',this.render);
//			this.listenTo(model_globals.MainDiagram,'remove:connection',this.render);
//			this.listenTo(model_globals.MainDiagram,'add:element',this.render);
//			this.listenTo(model_globals.MainDiagram,'add:element',this.attach_to_attributes);
//			this.listenTo(model_globals.MainDiagram,'add:connection',this.render);
		},
		
		attach_to_attributes:function(elem) {
			var attrs = elem.get('attributes');
			this.listenTo(attrs,'change add remove',this.render);
		},
		
		render: function() { 
			this.$('#xml_movers').empty();
			this.$('#xml_filters').empty();
			this.$('#xml_task_operations').empty();
			var mainElements = model_globals.MainDiagram.get('elements');
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
//			var has_linear = DiagramVerifier.has_linear_path();
//			if ( !has_linear ) {
//				return;
//			}
//			
//			var all_sources = DiagramVerifier.get_sources();
//			if ( _.isUndefined(all_sources) || all_sources.length == 0 ) {
//				return;
//			}
//			
			var element = model_globals.MainDiagram.find_first_element_in_diagram();
			if ( _.isUndefined(element) ) {
				return;
			}
			var htmlCode = element.get_protocols_string();
			this.$('#xml_protocols').append(htmlCode);
			
			if ( element.get('connections').size() == 0 ) {
				return;
			}
			
			while(element.get('connections').size() > 0){
				element = element.get('connections').at(0).get('target');
				var htmlCode = element.get_protocols_string();
				this.$('#xml_protocols').append(htmlCode);
			}
		}
		
	});
	
	return CodeView;
});
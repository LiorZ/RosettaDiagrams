var app = app || {};
$(function() {
	
	app.CodeView = Backbone.View.extend({
		el:'#code',
		
		initialize: function() {
			this.listenTo(app.Elements,'change',this.render);
			this.listenTo(app.Connections,'change',this.render);
		},
		
		render: function() { 
			console.log("rendering code ... ");
			this.$('#xml_movers').empty();
			this.$('#xml_filters').empty();
			app.Elements.each( function(element) {
				var codeView = new app.XMLMoversView({model: element});
				var htmlCode = codeView.render().el;
				var typeObj = element.get('typeObj');
				this.$(typeObj.codeTemplate).append(htmlCode);
			});
			this.renderConnections();
			//formatXml is located in the utils.js file. it formats the XML file to have better indentation
			var xml = vkbeautify.xml(this.$el.text());
			$('#display_code').text(xml);
			prettyPrint();
		},
		
		renderConnections: function() {
			var order=[];
			this.$('#xml_protocols').empty();
			app.Connections.each(function(con){
				for(var i=0; i<order.length; ++i ){
					if (order[i]==con.get('source')){
						order[i+1] = con.get('target');
						return;
					}
				}
				
				order[0]=con.get('source');
				order[1]=con.get('target');
			});
			for(var i=0; i<order.length; ++i){ 
				var protocolView = new app.XMLProtocolView({model: order[i]});
				var htmlCode = protocolView.render().el;
				this.$('#xml_protocols').append(htmlCode);
			}
		}
		
	});
});
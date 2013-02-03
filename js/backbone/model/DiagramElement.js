(function() {
	
	'use strict';


	app.DiagramElement = Backbone.Model.extend({
		
		defaults: {
			x:0,
			y:0,
			name:"New_Element",
			connectionReady: false,
			deleteMode: false,
			jointObj: undefined,
			attributes: undefined,
			typeObj: undefined
		},
		
		initialize: function() { 
			var new_attr_list = new app.AttributeList();
			new_attr_list.add(new app.Attribute({key:'name',value:'element_'+app.elementCounter++}));
			this.set('attributes', new_attr_list);
			
			this.listenTo(new_attr_list,"change",this.attributes_changed);
			this.listenTo(new_attr_list,"add",this.attributes_changed);
			this.listenTo(new_attr_list,"remove",this.attributes_changed);
			this.listenTo(app.Connections,"change",this.new_connection_formed);
		},
		
		new_connection_formed: function(new_con){ 
			console.log('new connection formed');
			console.log(new_con);
		},
		
		attributes_changed: function() {
			this.trigger("change");
		}
	});
	
}());
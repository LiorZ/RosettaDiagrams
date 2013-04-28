(function() {
	
	app.Diagram = Backbone.Model.extend({
		defaults:{
			elements:undefined,
			connections:undefined
		},
		initialize:function(options) {
			this.set('elements', new app.DiagramElementsOnCanvas());
			this.set('connections',new app.DiagramConnectionList());
			
			var elements = this.get('elements');
			var connections = this.get('connections');
			
			this.listenTo(elements,'add',this.element_added);
			this.listenTo(connections,'add',this.connection_added);
			
			this.listenTo(elements,'change',this.element_changed);
			this.listenTo(connections,'change',this.connection_changed);
			
			this.listenTo(elements,'remove',this.element_removed);
			this.listenTo(connections,'remove',this.connection_removed);
		},
		
		element_removed:function() {
			this.trigger('remove:element');
		},
		
		connection_removed:function() {
			this.trigger('remove:connection');
		},
		
		element_added:function(element) {
			element.set('parent_diagram',this);
			this.trigger('add:element',element);
			var this_model = this;
			this.listenTo(element,'add:element',function(element) { this_model.trigger('add:element',element)});
			this.listenTo(element,'add:connection',function(con) { this_model.trigger('add:connection',con)});
		},
		
		connection_added:function(new_con){
			this.trigger('add:connection',new_con);
		},
		
		element_by_jointObj: function(jointObj) {
			var elements = this.get('elements');
			return elements.byJointObject(jointObj);
		},
		
		element_changed:function(){
			this.trigger('change:element');
		},
		connection_changed:function() {
			this.trigger('change:connection');
		},
		
		connection_by_source:function(source) {
			var cons = this.get('connections');
			return cons.bySource(source);
		},
		connection_by_target:function(target){ 
			var cons = this.get('connections');
			return cons.byTarget(target);
		},
		add_connection:function(con) {
			this.get('connections').add(con);
		},
		
		add_element:function(element){
			this.get('elements').add(element);
		},
		is_empty: function() { 
			return (this.get('elements') == undefined || this.get('elements').length == 0 );
		},
		
		
		/**
		 * Returns elements ordered according to the way they appear on the diagram.
		 */
		get_ordered_elements:function() {
			var connections = this.get('connections');
			var order = [];
			if ( connections == undefined || connections.length == 0 )
				return [];
			
			connections.chain().filter(function (elem) {
				return elem.get('type') == Joint.dia.uml.dependencyArrow;
				
			} ).each(function(con){
				for(var i=0; i<order.length; ++i ){
					if (order[i]==con.get('source')){
						order.splice(i+1,0,con.get('target'));
						return;
					}else if (order[i] == con.get('target') ) {
						order.splice(i,0,con.get('source'));
						return;
					}
				}
				
				order.push(con.get('source'))
				order.push(con.get('target'));
			});
			
			return order;
		}
	});
	
}());
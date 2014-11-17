define(['Backbone','BackboneRelational','models/DiagramElementCollection','models/globals'],
		function(Backbone,BackboneRelational,DiagramElementCollection,globals) {
	var Diagram = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		url: function() {
			if ( this.isNew() ) {
				return "/diagram/new";
			}else {
				return "/diagram/" + this.id;
			}
		},
		initialize:function() {
			
		},
		relations: [
					{
						type: Backbone.HasMany,
						key: 'elements',
						relatedModel:'DiagramElement',
						collectionType: 'DiagramElementCollection',
						includeInJSON:true,
						collectionKey:'diagram',
						reverseRelation: {
							key: 'diagram',
							includeInJSON: '_id'
						}
					}
		],
		defaults: {
			name: "Untitled Diagram"
		},
		create_element: function(elem_obj) {
			var new_ele = this.get('elements').create(elem_obj);
			this.save();
		},
		is_empty: function() { 
			return (this.get('elements') == undefined || this.get('elements').length == 0 );
		},
		find_first_element_in_diagram: function() {
			var elements = this.get('elements').filter(function(elem){
				return elem.get('type') != 'task_operation'
			});
			if ( elements.length == 1 ) {
				return elements[0];
			}
			
			var first = _.find(elements,function(elem) {
				var connections = elem.get('pointed_by').filter(function(con){ return con.get('type') == 'connection' });
				return  ( connections.length == 0 && elem.get('connections').size() > 0 );
			});
			
			return first;
		},
		
		add_element:function(element){
			var l = this.get('elements').create(element);
			console.log("ELEMENT THAT WAS JUST CREATED: ");
			console.log(l);
		},
		
		get_ordered_elements:function() {
			var first_element = this.find_first_element_in_diagram();
			if ( _.isUndefined(first_element) || _.isNull(first_element) ) {
				return [];
			}
			var connections = first_element.get('connections');
			if ( connections.size() == 0 ){
				return [first_element];
			}
			var order = [first_element];
			while (connections.size() > 0) {
				var con = connections.at(0);
				var target = con.get('target');
				order.push(target);
				connections = target.get('connections');
			}
			
			return order;
		},
		element_by_jointObj: function(jointObj) {
			var elements = this.get('elements');
			return elements.byJointObject(jointObj);
		},
		
	});
	
	globals.Diagram = Diagram;
	
	return Diagram;
});
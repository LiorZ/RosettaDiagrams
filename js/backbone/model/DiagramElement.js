(function() {
	
	'use strict';


	app.DiagramElement = Backbone.Model.extend({
		
		defaults: {
			x:500,
			y:500,
			name:"New_Element",
			connectionReady: false,
			deleteMode: false,
			jointObj: undefined,
			attributes: undefined,
			typeObj: undefined,
			type:undefined,
			width: 0, // defined in the initialize section, getting an undefined value here .. 
			height: 0,
			container:undefined //an element that contains that particular element
		},
		
		initialize: function() { 
			var existing_arr = this.get('attributes');
			var new_attr_list;
			/*If the passing object is json, set the array from json. (when the application starts)
			 * Else, initialize an empty list and let the paletteview add all the relevant attributes
			 * 
			 */
			if ( Object.prototype.toString.call(existing_arr) === '[object Array]'){ 
				new_attr_list = new app.AttributeList(existing_arr); 
			}else {
				new_attr_list = new app.AttributeList();
			}
			
			this.set('attributes', new_attr_list);
			this.set('typeObj',app.Attributes[this.get('type')]);
			this.set('width',consts.DIAGRAM_ELEMENT_DEFAULT_WIDTH);
			this.set('height',consts.DIAGRAM_ELEMENT_DEFAULT_HEIGHT);
			
			
			this.listenTo(new_attr_list,"change",this.attributes_changed);
			this.listenTo(new_attr_list,"add",this.attributes_changed);
			this.listenTo(new_attr_list,"remove",this.attributes_changed);
		},
		
		attributes_changed: function() {
			this.trigger("change:attributes");
		},
		add_attributes:function(json_attrs) {
			var attributes = this.get('attributes');
			if ( attributes == undefined ){
				attributes = new app.AttributeList();
				this.set('attributes',attributes);
			}
			attributes.add(json_attrs);
				
		},
		set_name_attribute:function(name_value) {
			var attr = this.get('attributes');
			if ( attr == undefined ) {
				attr = new app.AttributeList();
				this.set('attributes',attr);
			}
			var name_arr = attr.filter(function(element){
				return element.get('key') == 'name';
			});
			if ( name_arr.length > 1 ) {
				alert ("Error! 2 name attributes found.");
				return;
			}else if (name_arr.length == 0){
				attr.add(new app.Attribute({key:'name',value:name_value}));
				return;
			}else {
				var name_attr = name_arr[0];
				name_attr.set('value',name_value);
			}
			
			
		}
	});
	
}());
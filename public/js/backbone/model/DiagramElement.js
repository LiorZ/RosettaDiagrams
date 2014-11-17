define(['Backbone','BackboneRelational','models/DiagramConnectionCollection','models/Diagram','models/DiagramLink','models/DiagramConnection','models/DiagramContainment'
        ,'models/BaseAttribute','models/Attribute','models/AttributeList','models/globals','views/globals'],
		function(Backbone,BackboneRelational,DiagramConnectionCollection,Diagram,DiagramLink,DiagramConnection,DiagramContainment,BaseAttribute,Attribute,
				AttributeList,model_globals,view_globals) {
	var DiagramElement = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		url:function() {
			if ( this.isNew() ){
				return '/element/new';
			}else {
				return '/element/id/'+ this.id;
			}
		},
		relations: [
					{
						type: Backbone.HasMany,
						key: 'connections',
						relatedModel: DiagramLink,
						collectionType: DiagramConnectionCollection,
						reverseRelation: {
							key: 'source',
							includeInJSON: '_id',
						}
					},
					{
						type: Backbone.HasMany,
						key: 'pointed_by',
						relatedModel: DiagramLink,
						collectionType: DiagramConnectionCollection,
						reverseRelation: {
							key: 'target',
							includeInJSON: '_id',
						}
					},
					
					
					{
						type:Backbone.HasMany,
						key:'attributes',
						relatedModel:BaseAttribute,
						collectionType:'AttributeList',
						reverseRelation: {
							key: 'element',
							includeInJSON: '_id',
							type:Backbone.HasOne
						}
					},
					{
						type: Backbone.HasOne,
						key:'subdiagram',
						relatedModel:"Diagram",
						reverseRelation: {
							key: 'parent_element',
							includeInJSON: '_id',
							type: Backbone.HasOne
						}
					}
				],
				defaults: {
					name:"New_Element",
					connectionReady: false,
					deleteMode: false,
					jointObj: undefined,
					typeObj: undefined,
					type:undefined,
					width: 0, // defined in the initialize section, getting an undefined value here .. 
					height: 0,
					show_in_protocols:true,
					x:300,
					y:300
				},
			initialize: function(options) {
				var subdiagram;
				if ( this.get('subdiagram') ) {
					subdiagram = this.get('subdiagram');
				}else {
					subdiagram = new Diagram();
					this.set('subdiagram',subdiagram);
				}

				this.set('typeObj',view_globals.Attributes[this.get('type')]);
				this.set('width',view_globals.DIAGRAM_ELEMENT_DEFAULT_WIDTH);
				this.set('height',view_globals.DIAGRAM_ELEMENT_DEFAULT_HEIGHT);

				var attributes = this.get('attributes');
				if ( _.isUndefined(attributes.byKey('name') ) )
					this.set_name_attribute('element_'+(model_globals.elementCounter++));
				
				this.listenTo(this.get('connections'),'change add remove',function() {this.trigger('change')});
				this.listenTo(attributes,'change add remove',function() { this.trigger('change')});
				this.listenTo(subdiagram,'add:element',this.element_added_subdiagram);
				this.listenTo(subdiagram,'add:connection',this.connection_added);
				this.listenTo(attributes,"change",this.attributes_changed);
				this.listenTo(attributes,"add",this.attributes_changed);
				this.listenTo(attributes,"remove",this.attributes_changed);
				this.listenTo(view_globals.event_agg,'connection_mode_activated',this.connection_mode_activated);
				this.listenTo(view_globals.event_agg,'connection_mode_deactivated',this.connection_mode_deactivated);
			},
				
		set_name_attribute:function(name_value) {
			var attr = this.get('attributes');
			if ( attr === undefined ) {
				attr = new AttributeList();
				this.set('attributes',attr);
			}
			var name_arr = this.get_name_attribute();
			if (name_arr == undefined || name_arr.length == 0){
				attr.add(new Attribute({key:'name',value:name_value}));
				return;
			}
			
			if ( name_arr.length > 1 ) {
				alert ("Error! more than one name attributes found.");
				return;
			}
	
			var name_attr = name_arr[0];
			name_attr.set('value',name_value);
		
		
		},
		add_attributes:function(json_attrs) {
			var attributes = this.get('attributes');
			if ( attributes == undefined ){
				attributes = new AttributeList();
				this.set('attributes',attributes);
			}
			attributes.add(json_attrs);
		},
		add_attribute: function(key,value){
			this.get('attributes').create({key:key,value:value});
		},
		element_added_subdiagram:function(element) {
			this.trigger('add:element',element);
		},
		connection_mode_deactivated:function(options) {
			this.set('connectionReady',false);
		},
		connection_mode_activated:function(options) {
			this.set('connectionReady',true);
		},
		connection_added: function(con) {
			this.trigger('add:connection',con);
		},
		attributes_changed: function() {
//			this.trigger("change:attributes");
		},
		connect_element: function(){
			var type = this.get('type');
			if ( _.isUndefined( model_globals.pendingConnection ) ) {
			
				if ( type == 'task_operation' ) {
					model_globals.pendingConnection = { source: this, type: 'containment'};
				}
				else {
					model_globals.pendingConnection = {source: this, type:'connection'};
				}
			
				view_globals.event_agg.trigger('connection_mode_activated',{info_msg: {message: "Click on the element you want to connect ... (<b>ESC</b> to cancel) "}});
			}
			else {
				//TODO: check if both elements are from the same diagram ...
				//TODO: check if target isn't the same as source
				model_globals.pendingConnection.target = this;
				var new_connection = model_globals.pendingConnection.source.get('connections').create(model_globals.pendingConnection);
				model_globals.pendingConnection = undefined;
				return new_connection;
			}
		},
		get_name_attribute: function() {
			var attrs = this.get('attributes');
			var name_arr = attrs.filter(function(element){
				return element.get('key') == 'name';
			});
			if ( name_arr.length == 0 ) {
				return undefined;
			}
			return name_arr[0];
		},
		
		get_nested_elements_string:function(protocol_form) {
			var subdiagram = this.get('subdiagram');
			var string ='';
			if (subdiagram == undefined || subdiagram.is_empty() )
				return undefined;
			var ordered_elements = subdiagram.get_ordered_elements();
			_.each(ordered_elements,function(element){
				if (protocol_form)
					string += element.get_protocols_string();
				else 
					string += element.get_declaration_string();
			});
			return string;
		},
		
		get_declaration_string:function() {
			var string = '&lt;' + this.get('name') + ' ';
			var attr_non_empty = this.get('attributes').nonEmpty();
			_.each(attr_non_empty,function(attr){
				string += attr.get('key') + '=' + "\"" + attr.get('value')+ "\" ";
			});
			
			var nested_elements_string = this.get_nested_elements_string(true);
			if (nested_elements_string === undefined)
				string += '/&gt;';
			else { 
				string += '&gt;'+ nested_elements_string + '&lt;/'+this.get('name')+'&gt;';
			}
			
			var nested_elements_non_protocol = this.get_nested_elements_string(false);
			if (!_.isUndefined(nested_elements_non_protocol )) {
				string = nested_elements_non_protocol + string;
			}
			return string;
		}, 
	
	get_protocols_string: function() {
		if ( !this.get('show_in_protocols') ){
			return '';
		}
		var attributes = this.get('attributes');
		var name_attr = attributes.byKey('name');
		if ( name_attr == undefined ) {
			alert("Can't find name attribute");
			return;
		}
		var string = '&lt;Add ' + this.get('typeObj').add_protocol + '=' + name_attr.get('value')  + '/&gt;';
		return string;
	},
	toJSON: function(options) {
		var json = this.constructor.__super__.toJSON.apply(this, [options]);
		return _.omit(json,['jointObj','connectionReady','deleteMode']);
	} 
	});
	model_globals.DiagramElement = DiagramElement;
	
	return DiagramElement;
});


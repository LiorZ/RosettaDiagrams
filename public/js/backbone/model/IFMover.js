define(['Backbone','BackboneRelational','models/DiagramElement','models/globals'],function(Backbone,BackboneRelational,DiagramElement,globals) {
	var IFMover = DiagramElement.extend({
		defaults:{
			true_is_set:false,
			false_is_set:false,
			filter:undefined,
		},
		
		initialize:function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			var connections = app.ActiveDiagram.get('connections');
			this.listenTo(connections,'add',this.handle_connect_filter);
		},
		
		get_filter_name_attr: function(source) {
			var attr = this.get('attributes').byKey('filter_name');
			if ( _.isUndefined(attr) ) {
				var source_name = source.get('attributes').byKey('name');
				attr = new app.Attribute({key:'filter_name', value:source_name.get('value')});
				this.get('attributes').add(attr);
			}
			return attr;
		},
		
		listen_to_new_source:function(new_source) {
			var new_attr = this.get_filter_name_attr();
			new_attr.listenTo(new_source,'destroy',new_attr.destroy);
			var src_name_attr = new_source.get('attributes').byKey('name');
			if ( src_name_attr != undefined ) {
				new_attr.listenTo(src_name_attr,'change:value',function(model,new_val,options) {
					new_attr.set('value',new_val);
				});
			}
		},
		
		handle_connect_filter: function(conn) {
			console.log("handle_connect_filter");

			var target = conn.get('target');
			var source = conn.get('source');
			if ( target != this ){
				return;
			}
			var new_attr = this.get_filter_name_attr(source);
			this.listen_to_new_source(source);
			//destroy when the source is destroyed:
			
			var context = this; 
			
			new_attr.listenTo(conn,'change:source',function(model,new_source,options) {
				context.replace_filter_name(model, new_source, options);
			});
			
			new_attr.listenTo(conn,'change:target',new_attr.destroy);
		},
		
		replace_filter_name:function(model,new_source,options) {
			var attr_filter = this.get('attributes').byKey('filter_name');
			if ( attr_filter == undefined )
				return;
			var new_attr = new_source.get('attributes').byKey('name');
			attr_filter.set('value',new_attr.get('value'));
			var prev_model = model.previousAttributes();

			this.disconnect_from_source(prev_model.source);
			this.listen_to_new_source(new_source);
		},
		
		disconnect_from_source:function(old_source) {
			this.stopListening(old_source);
			var old_src_attr = old_source.get('attributes').byKey('name');
			
			var filter_name_attr = this.get_filter_name_attr();
			filter_name_attr.stopListening(old_source);
			filter_name_attr.stopListening(old_src_attr);
		},
		
		connect_element:function() {
			var title='';
			var func;
			var destroy_func;
			var info_msg_model;
			if ( !this.get('true_is_set') ) {
				title = "True";
				func=function(model) {
					this.set_target(model,{mover_name:'true_mover_name', key_to_set:'true_is_set'});
					this.set('true_is_set',true);
				};
				destroy_func = function() {
					this.connection_destroyed({mover_name:'true_mover_name', key_to_set:'true_is_set'});
				};
			}else if (!this.get('false_is_set')){
				title = "False";
				func=function(model) {
					this.set_target(model,{mover_name:'false_mover_name', key_to_set:'false_is_set'});
				};
				destroy_func = function(){
					this.connection_destroyed({mover_name:'false_mover_name', key_to_set:'false_is_set'});
				}
			}else {
				app.pendingConnection = new app.DiagramConnection({source: this, type: Joint.dia.uml.dependencyArrow});
				info_msg_model = new app.InformationMessage({message: "Click on the element you want to connect ... (<b>ESC</b> to cancel"});
				app.EventAgg.trigger('connection_mode_activated',{info_msg: info_msg_model});
				return;
			}
			info_msg_model = new app.InformationMessage({message: "Click on the element that serves as the <b>" + title+"</b> mover ... (<b>ESC</b> to cancel) "});

			app.pendingConnection = new app.DiagramConnection({source: this, type: Joint.dia.uml.dependencyArrow, title:title});
			this.listenTo(app.pendingConnection,'change:target',func);
			this.listenTo(app.pendingConnection,'destroy',destroy_func);
			app.EventAgg.trigger('connection_mode_activated',{info_msg: info_msg_model});
		},
		set_target:function(model,options) {
			console.log(options)
			var attrs = this.get('attributes');
			var attr = attrs.byKey(options.mover_name);
			if ( attr == undefined ) {
				attr = new app.Attribute({key:options.mover_name});
				attrs.add(attr);
			}
			var target = model.get('target');
			if ( target == undefined ) {
				return;
			}
			var model_name = target.get('attributes').byKey('name');
			if (model_name == undefined){
				alert("Target mover Name not defined!")
				return;
			}
			attr.set('value',model_name.get('value'));
			target.set('show_in_protocols',false);
			this.set(options.key_to_set,true);
		},
		connection_destroyed:function(options) {
			this.set(options.key_to_set,false);
			this.get('attributes').byKey(options.mover_name).set('value','');
		}
	});
	_.extend(IFMover.prototype.defaults,DiagramElement.prototype.defaults);
	
	globals.IFMover = IFMover;
	
	return IFMover;

});
//
//(function() {
//	
//	'use strict';
//
//
//	app.IFMover = app.DiagramElement.extend({
//		defaults:{
//			true_is_set:false,
//			false_is_set:false,
//			filter:undefined,
//		},
//		
//		initialize:function(options) {
//			this.constructor.__super__.initialize.apply(this, [options]);
//			var connections = app.ActiveDiagram.get('connections');
//			this.listenTo(connections,'add',this.handle_connect_filter);
//		},
//		
//		get_filter_name_attr: function(source) {
//			var attr = this.get('attributes').byKey('filter_name');
//			if ( _.isUndefined(attr) ) {
//				var source_name = source.get('attributes').byKey('name');
//				attr = new app.Attribute({key:'filter_name', value:source_name.get('value')});
//				this.get('attributes').add(attr);
//			}
//			return attr;
//		},
//		
//		listen_to_new_source:function(new_source) {
//			var new_attr = this.get_filter_name_attr();
//			new_attr.listenTo(new_source,'destroy',new_attr.destroy);
//			var src_name_attr = new_source.get('attributes').byKey('name');
//			if ( src_name_attr != undefined ) {
//				new_attr.listenTo(src_name_attr,'change:value',function(model,new_val,options) {
//					new_attr.set('value',new_val);
//				});
//			}
//		},
//		
//		handle_connect_filter: function(conn) {
//			console.log("handle_connect_filter");
//
//			var target = conn.get('target');
//			var source = conn.get('source');
//			if ( target != this ){
//				return;
//			}
//			var new_attr = this.get_filter_name_attr(source);
//			this.listen_to_new_source(source);
//			//destroy when the source is destroyed:
//			
//			var context = this; 
//			
//			new_attr.listenTo(conn,'change:source',function(model,new_source,options) {
//				context.replace_filter_name(model, new_source, options);
//			});
//			
//			new_attr.listenTo(conn,'change:target',new_attr.destroy);
//		},
//		
//		replace_filter_name:function(model,new_source,options) {
//			var attr_filter = this.get('attributes').byKey('filter_name');
//			if ( attr_filter == undefined )
//				return;
//			var new_attr = new_source.get('attributes').byKey('name');
//			attr_filter.set('value',new_attr.get('value'));
//			var prev_model = model.previousAttributes();
//
//			this.disconnect_from_source(prev_model.source);
//			this.listen_to_new_source(new_source);
//		},
//		
//		disconnect_from_source:function(old_source) {
//			this.stopListening(old_source);
//			var old_src_attr = old_source.get('attributes').byKey('name');
//			
//			var filter_name_attr = this.get_filter_name_attr();
//			filter_name_attr.stopListening(old_source);
//			filter_name_attr.stopListening(old_src_attr);
//		},
//		
//		connect_element:function() {
//			var title='';
//			var func;
//			var destroy_func;
//			var info_msg_model;
//			if ( !this.get('true_is_set') ) {
//				title = "True";
//				func=function(model) {
//					this.set_target(model,{mover_name:'true_mover_name', key_to_set:'true_is_set'});
//					this.set('true_is_set',true);
//				};
//				destroy_func = function() {
//					this.connection_destroyed({mover_name:'true_mover_name', key_to_set:'true_is_set'});
//				};
//			}else if (!this.get('false_is_set')){
//				title = "False";
//				func=function(model) {
//					this.set_target(model,{mover_name:'false_mover_name', key_to_set:'false_is_set'});
//				};
//				destroy_func = function(){
//					this.connection_destroyed({mover_name:'false_mover_name', key_to_set:'false_is_set'});
//				}
//			}else {
//				app.pendingConnection = new app.DiagramConnection({source: this, type: Joint.dia.uml.dependencyArrow});
//				info_msg_model = new app.InformationMessage({message: "Click on the element you want to connect ... (<b>ESC</b> to cancel"});
//				app.EventAgg.trigger('connection_mode_activated',{info_msg: info_msg_model});
//				return;
//			}
//			info_msg_model = new app.InformationMessage({message: "Click on the element that serves as the <b>" + title+"</b> mover ... (<b>ESC</b> to cancel) "});
//
//			app.pendingConnection = new app.DiagramConnection({source: this, type: Joint.dia.uml.dependencyArrow, title:title});
//			this.listenTo(app.pendingConnection,'change:target',func);
//			this.listenTo(app.pendingConnection,'destroy',destroy_func);
//			app.EventAgg.trigger('connection_mode_activated',{info_msg: info_msg_model});
//		},
//		set_target:function(model,options) {
//			console.log(options)
//			var attrs = this.get('attributes');
//			var attr = attrs.byKey(options.mover_name);
//			if ( attr == undefined ) {
//				attr = new app.Attribute({key:options.mover_name});
//				attrs.add(attr);
//			}
//			var target = model.get('target');
//			if ( target == undefined ) {
//				return;
//			}
//			var model_name = target.get('attributes').byKey('name');
//			if (model_name == undefined){
//				alert("Target mover Name not defined!")
//				return;
//			}
//			attr.set('value',model_name.get('value'));
//			target.set('show_in_protocols',false);
//			this.set(options.key_to_set,true);
//		},
//		connection_destroyed:function(options) {
//			this.set(options.key_to_set,false);
//			this.get('attributes').byKey(options.mover_name).set('value','');
//		}
//	});
//	_.extend(app.IFMover.prototype.defaults,app.DiagramElement.prototype.defaults);
//	}());
		
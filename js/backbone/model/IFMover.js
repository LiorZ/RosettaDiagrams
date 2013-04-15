(function() {
	
	'use strict';


	app.IFMover = app.DiagramElement.extend({
		defaults:{
			true_is_set:false,
			false_is_set:false
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
	_.extend(app.IFMover.prototype.defaults,app.DiagramElement.prototype.defaults);
	}());
		
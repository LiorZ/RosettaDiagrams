define(['Backbone','BackboneRelational','models/DiagramConnection','models/globals','models/TaskOAttribute','models/DiagramLink'],
		function(Backbone,BackboneRelational,DiagramConnection,globals,TaskOAttribute,DiagramLink) {
	var DiagramContainment = DiagramLink.extend({
		defaults:{
			type:'containment'
		},
		initialize: function(options) {
		      this.constructor.__super__.initialize.apply(this, [options]);
		      //this.change_target(this, this.get('target'));
		      this.listenTo(this,'change:source',this.change_source);
		      this.listenTo(this,'change:target',this.change_target);
		      this.listenTo(this,'destroy',this.remove_tasks); //Remove all the task operations from the target.
		},
		
		remove_tasks:function() {
			var attributes = this.get('target').get('attributes');
			var name = this.get('source').get('attributes').byKey('name');
			if ( name == undefined ){
				alert("Name attributes is not defined");
				return;
			}
			var key_to_remove = name.get('value');
			var new_tasks = this.remove_key_from_tasks(attributes,key_to_remove);
			if ( new_tasks.length == 0 ) {
				attributes.byKey('task_operations').destroy();
			}else { 
				attributes.byKey('task_operations').set('value',new_tasks.join(','));
			}
		},
		
		remove_key_from_tasks:function(arr,key_to_remove) {
			var tasks = arr.byKey('task_operations');
			var tasks_str = tasks.get('value');
			var task_arr = tasks_str.split(',');
			for (var i=0; i<task_arr.length; ++i) {
				if ( task_arr[i] == key_to_remove ){
					console.log("removing " + task_arr[i]);
					task_arr.splice(i,1);
					break;
				}
			}
			return task_arr;
		},
		
		remove_old:function() {
			var prev_target = this.previous('target');
			var source_name = this.get('source').get('attributes').byKey('name').get('value');
			if ( prev_target == undefined )
				return;
			var attributes = prev_target.get('attributes')
			if (attributes == undefined)
				return;
			var task_arr = this.remove_key_from_tasks(attributes,source_name);
			
			//Remove the taskoperation directive in no longer needed:
			if ( task_arr.length == 0) {
				attributes.byKey('task_operations').destroy();
			}else { 
				var prev_tasks = attributes.byKey('task_operations');
				if ( prev_tasks == undefined ) {
					alert("Unexpected error: previous tasks are not defined")
					return;
				}
				
				prev_tasks.set('value',task_arr.join(','));
			}
		},
		
		change_source:function(this_model,new_source) {
			if ( this.previous('source') == undefined )
				return;
			
			var old_task_name = this.previous('source').get('attributes').byKey('name').get('value');
			var task_name = new_source.get('attributes').byKey('name').get('value');
			var target_tasks = this.get('target').get('attributes');
			var new_target_tasks = this.remove_key_from_tasks(target_tasks,old_task_name);
			new_target_tasks.push(task_name);
			target_tasks.byKey('task_operations').set('value',new_target_tasks.join(','));
			
		},
		
		change_target: function(this_model,new_target) {
			var source = this.get('source')
			var new_attributes = new_target.get('attributes'); // TODO: check what happens if the taskop is already there ...
			if ( new_attributes == undefined ){
				alert("Attributes in target doesn't exist!");
				return;
			}	
			
			var tasks = new_attributes.byKey('task_operations');
			if ( tasks == undefined ) {
				new_attributes.add(new TaskOAttribute({key: 'task_operations'}));
				tasks = new_attributes.byKey('task_operations');
			}
			if ( !(tasks instanceof TaskOAttribute )) {
				new_attributes.remove(tasks,{silent:true});
				tasks = new TaskOAttribute();
				new_attributes.add(tasks,{silent:true});
			}
			tasks.add_task(source);	
			
			var prev_target = this.previous('target');
			if ( prev_target == undefined )
				return;
			var old_tasks = prev_target.get('attributes').byKey('task_operations');
			if ( old_tasks == undefined )
				return;
			old_tasks.remove_task(source);
		}
	});
	
	globals.DiagramContainment = DiagramContainment;
	
	return DiagramContainment;
});
//
//(function() {
//	
//	'use strict';
//
//	app.DiagramContainment = app.DiagramConnection.extend({
//		initialize: function(options) {
//		      this.constructor.__super__.initialize.apply(this, [options])
//		      this.on('change:source',this.change_source);
//		      this.on('change:target',this.change_target);
//		      this.on('destroy',this.remove_tasks); //Remove all the task operations from the target.
//		},
//		remove_tasks:function() {
//			var attributes = this.get('target').get('attributes');
//			var name = this.get('source').get('attributes').byKey('name');
//			if ( name == undefined ){
//				alert("Name attributes is not defined");
//				return;
//			}
//			var key_to_remove = name.get('value');
//			var new_tasks = this.remove_key_from_tasks(attributes,key_to_remove);
//			if ( new_tasks.length == 0 ) {
//				attributes.byKey('task_operations').destroy();
//			}else { 
//				attributes.byKey('task_operations').set('value',new_tasks.join(','));
//			}
//		},
//		
//		remove_key_from_tasks:function(arr,key_to_remove) {
//			var tasks = arr.byKey('task_operations');
//			var tasks_str = tasks.get('value');
//			var task_arr = tasks_str.split(',');
//			for (var i=0; i<task_arr.length; ++i) {
//				if ( task_arr[i] == key_to_remove ){
//					console.log("removing " + task_arr[i]);
//					task_arr.splice(i,1);
//					break;
//				}
//			}
//			return task_arr;
//		},
//		
//		remove_old:function() {
//			var prev_target = this.previous('target');
//			var source_name = this.get('source').get('attributes').byKey('name').get('value');
//			if ( prev_target == undefined )
//				return;
//			var attributes = prev_target.get('attributes')
//			if (attributes == undefined)
//				return;
//			var task_arr = this.remove_key_from_tasks(attributes,source_name);
//			
//			//Remove the taskoperation directive in no longer needed:
//			if ( task_arr.length == 0) {
//				attributes.byKey('task_operations').destroy();
//			}else { 
//				var prev_tasks = attributes.byKey('task_operations');
//				if ( prev_tasks == undefined ) {
//					alert("Unexpected error: previous tasks are not defined")
//					return;
//				}
//				
//				prev_tasks.set('value',task_arr.join(','));
//			}
//		},
//		
//		change_source:function(this_model,new_source) {
//			if ( this.previous('source') == undefined )
//				return;
//			
//			var old_task_name = this.previous('source').get('attributes').byKey('name').get('value');
//			var task_name = new_source.get('attributes').byKey('name').get('value');
//			var target_tasks = this.get('target').get('attributes');
//			var new_target_tasks = this.remove_key_from_tasks(target_tasks,old_task_name);
//			new_target_tasks.push(task_name);
//			target_tasks.byKey('task_operations').set('value',new_target_tasks.join(','));
//			
//		},
//		
//		change_target: function(this_model,new_target) {
//			var source = this.get('source')
//			var new_attributes = new_target.get('attributes'); // TODO: check what happens if the taskop is already there ...
//			if ( new_attributes == undefined ){
//				alert("Attributes in target doesn't exist!");
//				return;
//			}	
//			var tasks = new_attributes.byKey('task_operations');
//			if ( tasks == undefined ) {
//				new_attributes.add(new app.TaskOAttribute({key: 'task_operations'}));
//				tasks = new_attributes.byKey('task_operations');
//			}
//			if ( !(tasks instanceof app.TaskOAttribute )) {
//				new_attributes.remove(tasks,{silent:true});
//				tasks = new app.TaskOAttribute();
//				new_attributes.add(tasks,{silent:true});
//			}
//			tasks.add_task(source);	
//			
//			var prev_target = this.previous('target');
//			if ( prev_target == undefined )
//				return;
//			var old_tasks = prev_target.get('attributes').byKey('task_operations');
//			if ( old_tasks == undefined )
//				return;
//			old_tasks.remove_task(source);
//
//		}
//		
//		
//	
//	})
//}());

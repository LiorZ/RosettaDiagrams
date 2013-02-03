(function() {
	
	'use strict';

	app.DiagramContainment = app.DiagramConnection.extend({
		initialize: function(options) {
		      this.constructor.__super__.initialize.apply(this, [options])
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
				tasks.set('value',task_arr.join());
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
			var attributes = new_target.get('attributes');
			var source = this.get('source');
			var task_name = source.get('attributes').byKey('name');
			if ( task_name == undefined ){
				alert("Task operation has no name!");
				return;
			}
			if ( attributes == undefined ){
				alert("Attributes in target doesn't exist!");
				return;
			}
			
			this.remove_old();
			var tasks = attributes.byKey('task_operations');
			if (tasks == undefined){
				attributes.add(new app.Attribute({key:'task_operations',value:task_name.get('value')}));
			}else {
				var task_value = tasks.get('value');
				task_value = task_value +','+task_name.get('value');
				tasks.set('value',task_value);
			}
		}
		
		
	
	})
}());
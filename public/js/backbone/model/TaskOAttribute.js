define(['Backbone','BackboneRelational','models/BaseAttribute','models/globals'],
		function(Backbone,BackboneRelational,BaseAttribute,globals) {
	
	var TaskOAttribute = BaseAttribute.extend({
		defaults:{
			type:'task_operation'
		},
		initialize: function(options) {
			this.constructor.__super__.initialize.apply(this, [options]);
			this.set('moversList',new Backbone.Collection());
			this.set('key','task_operations');
			this.listenTo( this.get('moversList'), 'add remove', this.reset_value );
		},
		
		reset_value:function() {
			
			var movers = this.get('moversList');
			
			if ( movers.length == 0 ){
				this.destroy();
				return;
			}
			
			var value_arr = [];
			movers.each(function(mover){
				var attributes = mover.get('attributes');
				var nameStr = attributes.byKey('name').get('value');
				value_arr.push(nameStr);
			});
			
			this.set('value',value_arr.join(','));
		},
		
		add_task: function(new_task_element) {
			var name_attr = new_task_element.get('attributes').byKey('name');
			if ( _.isUndefined(name_attr) ) {
				throw new Error("No Name attribute");
			}
			this.listenTo(name_attr,'change:value',this.reset_value);
			this.get('moversList').add(new_task_element);
		},
		
		remove_task: function(task) {
			var name_attr = task.get('attributes').byKey('name');
			if ( _.isUndefined(name_attr) ) {
				throw new Error("No Name attribute");
			}
			this.stopListening(name_attr);
			this.get('moversList').remove(task);
		}
		
	});
	
	globals.TaskOAttribute = TaskOAttribute;
	
	return TaskOAttribute;
});
//
//var app = app || {};
//(function() {
//		
//	'use strict';
//
//	app.TaskOAttribute = app.Attribute.extend({
//		
//		initialize: function(options) {
//   	      this.constructor.__super__.initialize.apply(this, [options])
//			this.set('moversList',new app.DiagramElementList());
//			this.set('key','task_operations');
//			this.listenTo( this.get('moversList'), 'add remove change', this.reset_value );
//		},
//		
//		reset_value:function() {
//			var movers = this.get('moversList');
//			
//			if ( movers.length == 0 )
//				this.destroy();
//			
//			var value_arr = [];
//			movers.each(function(mover){
//				var attributes = mover.get('attributes');
//				var nameStr = attributes.byKey('name').get('value');
//				value_arr.push(nameStr);
//			});
//			
//			this.set('value',value_arr.join(','));
//		},
//		
//		add_task: function(new_task_element) {
//			var name_attr = new_task_element.get('attributes').byKey('name');
//			this.listenTo(name_attr,'change:value',this.reset_value);
//			this.get('moversList').add(new_task_element);
//		},
//		remove_task: function(task) {
//			var name_attr = task.get('attributes').byKey('name');
//			this.stopListening(name_attr);
//			this.get('moversList').remove(task);
//		}
//		
//	});
//
//}
//());
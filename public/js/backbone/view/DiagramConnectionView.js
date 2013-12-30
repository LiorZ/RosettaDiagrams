define(['models/globals','views/globals','Backbone'],function(model_globals,view_globals,Backbone){
	var DiagramConnectionView = Backbone.View.extend({
		initialize: function() {
			var model = this.model;
			var source = model.get('source');
			var target =  model.get('target');
			var target_joint = target.get('jointObj');
			var jointObj = source.get('jointObj').joint(target_joint,_.extend(view_globals.Attributes[model.get('type')].jointObj,{label:this.model.get("title")}));
			var dom_obj = jointObj.dom.connection[jointObj.dom.connection.length-1];
			
			this.$el = $(dom_obj.node);
			
			var elements = model_globals.ActiveDiagram.get('elements');
			if ( elements ) {
				jointObj.registerForever(elements.as_joints_array());
			}
			
			model.set('jointObj',jointObj);
			
			var obj = this.model;
			var view = this;	
			jointObj.registerCallback("justConnected",function(side) {
				var rawElement = this.wholeShape;
				
				var element = model_globals.ActiveDiagram.element_by_jointObj(this);
				var target_by_connection = element.get('pointed_by').at(0);
				var source_by_connection = element.get('connections').at(0);
				
				if ( source.get('type') != 'task_operation' && (side == 'end' && target_by_connection != undefined && target_by_connection != view.model) || 
						(side == 'start' && source_by_connection != undefined && source_by_connection != view.model)) {
					view.undo_connection(side);
					
					view_globals.event_agg.trigger('wrong_connection_created',{info_msg: {message:"Can't connect more than one node", type:'error',title:'Error: '}});
					return false;
				}
				
				view.stopListening(obj.get('source'));
				view.stopListening(obj.get('target'));
				obj.changeConnectedElement(side,rawElement);
				
				view.listenTo(obj.get('source'),'destroy',view.delete_connection_after_element);
				view.listenTo(obj.get('target'),'destroy',view.delete_connection_after_element);
				return true;
			});
			
			jointObj.registerCallback( "floating",function(side)  {
				view.undo_connection(side);
			});
			var context = this;
			jointObj.registerCallback("mouseEnter",function(m_x,m_y) {
				var options = {
						items_to_hide: context.which_menu_items()
				}
				view_globals.event_agg.trigger('show_menu_delay',context.model,{left:m_x,top:m_y},options);
			})
			
//			jointObj.registerCallback("redraw",function(new_obj) {
//				context.$el = $(new_obj.node);
//			});
			this.listenTo(this.model,'destroy',this.delete_connection_joint);

			this.listenTo(source,'destroy',this.delete_connection_after_element);
			this.listenTo(target,'destroy',this.delete_connection_after_element);
		},
		
		which_menu_items:function() {
			return ['#btn_connect','#btn_info','#btn_subdiagram'];
		},
		
		undo_connection:function(side){
			var jointObj = this.model.get('jointObj');
			var prev_node = jointObj.prev_node;
		    jointObj.replaceDummy(jointObj["_"+side], prev_node);
		    jointObj.addJoint(prev_node);
		    jointObj.update();	
		},
		delete_connection_after_element: function() {
			this.stopListening();
			this.model.destroy();
			this.remove();
		},
		
		delete_connection_joint:function() {
			var jointObj = this.model.get('jointObj');
			if ( jointObj != undefined ){
				Joint.dia.remove_joint(jointObj);
			}
		}
		
	});
	
	return DiagramConnectionView;
});

//var app = app || {};
//$(function() {
//	
//	app.DiagramConnectionView = Backbone.View.extend({
//		initialize: function() {
//			var model = this.model;
//			var source = model.get('source');
//			var target =  model.get('target');
//			var target_joint = target.get('jointObj');
//			var jointObj = source.get('jointObj').joint(target_joint,_.extend(model.get('type'),{label:this.model.get("title")}));
//			var dom_obj = jointObj.dom.connection[jointObj.dom.connection.length-1];
//			
//			this.$el = $(dom_obj.node);
//			
//			var elements = app.ActiveDiagram.get('elements');
//			if ( elements ) {
//				jointObj.registerForever(elements.as_joints_array());
//			}
//			
//			model.set('jointObj',jointObj);
//			
//			var obj = this.model;
//			var view = this;	
//			jointObj.registerCallback("justConnected",function(side) {
//				var rawElement = this.wholeShape;
//				
//				var element = app.ActiveDiagram.element_by_jointObj(this);
//				var target_by_connection = app.ActiveDiagram.connection_by_target(element);
//				var source_by_connection = app.ActiveDiagram.connection_by_source(element);
//				if ( source.get('type') != 'task_operation' && (side == 'end' && target_by_connection != undefined && target_by_connection != view.model) || 
//						(side == 'start' && source_by_connection != undefined && source_by_connection != view.model)) {
//					view.undo_connection(side);
//					
//					var info_msg_model = new app.InformationMessage({message:"Can't connect more than one node", type:'error',title:'Error: '});
//					app.EventAgg.trigger('wrong_connection_created',{info_msg: info_msg_model});
//					return false;
//				}
//				
//				view.stopListening(obj.get('source'));
//				view.stopListening(obj.get('target'));
//				obj.changeConnectedElement(side,rawElement);
//				
//				view.listenTo(obj.get('source'),'destroy',view.delete_connection_after_element);
//				view.listenTo(obj.get('target'),'destroy',view.delete_connection_after_element);
//				return true;
//			});
//			
//			jointObj.registerCallback( "floating",function(side)  {
//				view.undo_connection(side);
//			});
//			var context = this;
//			jointObj.registerCallback("mouseEnter",function(m_x,m_y) {
//				var options = {
//						items_to_hide: context.which_menu_items()
//				}
//				app.EventAgg.trigger('show_menu_delay',context.model,{left:m_x,top:m_y},options);
//			})
//			
////			jointObj.registerCallback("redraw",function(new_obj) {
////				context.$el = $(new_obj.node);
////			});
//			this.listenTo(this.model,'destroy',this.delete_connection_joint);
//
//			this.listenTo(source,'destroy',this.delete_connection_after_element);
//			this.listenTo(target,'destroy',this.delete_connection_after_element);
//		},
//		
//		which_menu_items:function() {
//			return ['#btn_connect','#btn_info','#btn_subdiagram'];
//		},
//		
//		undo_connection:function(side){
//			var jointObj = this.model.get('jointObj');
//			var prev_node = jointObj.prev_node;
//		    jointObj.replaceDummy(jointObj["_"+side], prev_node);
//		    jointObj.addJoint(prev_node);
//		    jointObj.update();	
//		},
//		delete_connection_after_element: function() {
//			this.stopListening();
//			this.model.destroy();
//			this.remove();
//		},
//		
//		delete_connection_joint:function() {
//			var jointObj = this.model.get('jointObj');
//			if ( jointObj != undefined ){
//				Joint.dia.remove_joint(jointObj);
//			}
//		}
//		
//	});
	

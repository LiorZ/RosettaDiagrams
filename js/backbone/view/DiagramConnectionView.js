var app = app || {};
$(function() {
	
	app.DiagramConnectionView = Backbone.View.extend({
		
		initialize: function() {
			var model = this.model;
			var source = model.get('source');
			var target =  model.get('target');
			var target_joint = target.get('jointObj');
			var jointObj = source.get('jointObj').joint(target_joint,_.extend(model.get('type'),{label:this.model.get("title")}));
			model.set('jointObj',jointObj);
			
			var obj = this.model;
			var view = this;	
			jointObj.registerCallback("justConnected",function(side) {
				var rawElement = this.wholeShape;
				
				var element = app.ActiveDiagram.element_by_jointObj(this);
				var target_by_connection = app.ActiveDiagram.connection_by_target(element);
				var source_by_connection = app.ActiveDiagram.connection_by_source(element);
				if ( (side == 'end' && target_by_connection != undefined && target_by_connection != view.model) || 
						(side == 'start' && source_by_connection != undefined && source_by_connection != view.model)) {
					view.undo_connection(side);
					
					var info_msg_model = new app.InformationMessage({message:"Can't connect more than one node", type:'error',title:'Error: '});
					app.EventAgg.trigger('wrong_connection_created',{info_msg: info_msg_model});
					return false;
				}
				
				view.stopListening(obj.get('source'));
				view.stopListening(obj.get('target'));
				obj.changeConnectedElement(side,rawElement);
				
				view.listenTo(obj.get('source'),'destroy',view.delete_connection);
				view.listenTo(obj.get('target'),'destroy',view.delete_connection);
				return true;
			});
			
			jointObj.registerCallback( "floating",function(side)  {
				view.undo_connection(side);
			});
			
			this.listenTo(source,'destroy',this.delete_connection);
			this.listenTo(target,'destroy',this.delete_connection);
		},
		
		undo_connection:function(side){
			var jointObj = this.model.get('jointObj');
			var prev_node = jointObj.prev_node;
		    jointObj.replaceDummy(jointObj["_"+side], prev_node);
		    jointObj.addJoint(prev_node);
		    jointObj.update();	
		},
		
		delete_connection:function() {
			this.stopListening();
			this.model.destroy();
			this.remove();
		}
		
	});
	
});
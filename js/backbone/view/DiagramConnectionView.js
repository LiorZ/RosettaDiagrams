var app = app || {};
$(function() {
	
	app.DiagramConnectionView = Backbone.View.extend({
		
		initialize: function() {
			var model = this.model;
			var source = model.get('source');
			var target =  model.get('target');
			var target_joint = target.get('jointObj');
			var jointObj = source.get('jointObj').joint(target_joint,model.get('type'));
			console.log("JointObj: ");
			console.log(jointObj);
			model.set('jointObj',jointObj);
			
			var obj = this.model;
			var view = this;
			jointObj.registerCallback("justConnected",function(side) {
				var rawElement = this.wholeShape;
				view.stopListening(obj.get('source'));
				view.stopListening(obj.get('target'));
				obj.changeConnectedElement(side,rawElement);
				
				view.listenTo(obj.get('source'),'destroy',view.delete_connection);
				view.listenTo(obj.get('target'),'destroy',view.delete_connection);
			});
			
			jointObj.registerCallback( "floating",function(side)  {
			    jointObj.replaceDummy(jointObj["_"+side], this);
			    jointObj.addJoint(this);
			    jointObj.update();
			});
			
			this.listenTo(source,'destroy',this.delete_connection);
			this.listenTo(target,'destroy',this.delete_connection);
		},
		delete_connection:function() {
			this.stopListening();
			this.model.destroy();
			this.remove();
		}
		
	});
	
});
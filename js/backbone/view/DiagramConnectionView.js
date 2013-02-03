var app = app || {};
$(function() {
	
	app.DiagramConnectionView = Backbone.View.extend({
		
		initialize: function() {
			var model = this.model;
			var source = model.get('source');
			var target =  model.get('target')
			var target_joint = target.get('jointObj');
			var jointObj = source.get('jointObj').joint(target_joint,model.get('type'));
			
			model.set('jointObj',jointObj);
			
			var obj = this.model;
			jointObj.registerCallback("justConnected",function(side) {
				var rawElement = this.wholeShape;
				obj.changeConnectedElement(side,rawElement);
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
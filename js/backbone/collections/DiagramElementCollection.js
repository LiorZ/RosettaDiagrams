var app = app || {};

(function() {
	
	app.DiagramElementList = Backbone.Collection.extend({
		model: app.DiagramElement
		
	});
	
	
	app.DiagramElementsOnCanvas = app.DiagramElementList.extend({
		arr:[],
		initialize:function() {
			this.listenTo(this,'add',this.add_joint_listener);
			this.listenTo(this,'remove',this.remove_from_register);
			this.arr = new Array();
		},
		add_joint_listener:function(elem) {
			elem.once("change:jointObj",this.add_joint,this);
		},
		add_joint:function(elem) {
			this.arr.push(elem.get('jointObj'));
		},
		remove_from_register:function(elem){ 
			var arr = this.arr;
			var j = elem.get('jointObj');
			var ind = arr.indexOf(j);
			if ( ind < 0 )
				return;
			arr.splice(ind,1,j);
		},
		as_joints_array:function() {
			return this.arr;
			// we keep this array to allow the use of "RegisterForever" of joint which is much more elegant and efficient than using events..
		},
		byJointObject:function(joint_obj){
			var res= this.filter(function(object){
				return object.get('jointObj') == joint_obj.wholeShape;
			});
			if ( res == undefined )
				return undefined;
			if ( res.length != 1 ){
				alert("ERROR: Not one joint per page (length is " + res.length +")");
				return undefined;
			}
			return res[0];
		}
		
	});
	app.PaletteElements = new app.DiagramElementList();
	
	//handle the case where we want to add DiagramContainers where applicable.
	app.PaletteElements.add = function(model) {
		if ( model instanceof Array){
			var iterator = function(obj){ return obj.type=='logic'};
			var logic = _.filter(model,iterator);
			if (logic.length == 1 ){
				var new_model = new app.IFMover(logic[0])
				Backbone.Collection.prototype.add.call(this, new_model);				
			}
			model =_.reject(model,iterator);
			Backbone.Collection.prototype.add.call(this, model);
		}
	};
	app.PaletteElements.url='js/json/elements.json';
	
	app.PaletteElements.comparator = function(element) { 
		return element.get('name');
	}
}());
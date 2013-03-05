var app = app || {};

(function() {
	
	app.DiagramElementList = Backbone.Collection.extend({
		model: app.DiagramElement,
		
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
			/* we keep this array to allow the use of "RegisterForever" of joint which is much more elegant and efficient
			and elegant than using events..
			*/
		},
		byJointObject:function(joint_obj){
			var res= this.filter(function(object){
				console.log(object);
				console.log(joint_obj);
				return object.get('jointObj') == joint_obj.wholeShape;
			});
			if ( res == undefined )
				return undefined;
			if ( res.length != 1 ){
				alert("ERROR: Not one joint per page");
				return undefined;
			}
			return res[0];
		},
		
	});
	app.Elements = new app.DiagramElementsOnCanvas();
	app.PaletteElements = new app.DiagramElementList();
	app.PaletteElements.url='js/json/elements.json';
}());
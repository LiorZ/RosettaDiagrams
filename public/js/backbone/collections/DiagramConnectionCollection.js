var app = app || {};

(function() {
	
	app.DiagramConnectionList = Backbone.Collection.extend({
		model: app.DiagramConnection,
		bySourceRaw:function(elem) {
			var returned_arr = this.filter(function(dia) {return (dia.get('source') == elem);});
			if (returned_arr ==0 )
				return undefined;
			else
				return returned_arr;
		},
		byTargetRaw:function(elem) {
			var returned_arr = this.filter(function(dia) {return (dia.get('target') == elem);});
			if (returned_arr ==0 )
				return undefined;
			else
				return returned_arr;
		},
		
		bySource:function(elem) {
			_.bind(this.bySourceRaw, this);
			var elements= this.bySourceRaw(elem);
			if ( !_.isUndefined(elements) ){
				return elements[0];
			}
			return elements;
		},
		
		byTarget:function(elem) {
			_.bind(this.byTargetRaw,this);
			var elements= this.byTargetRaw(elem);
			if ( !_.isUndefined(elements) ){
				return elements[0];
			}
			return elements;
		},
		
		bySomethingNoTasks:function(elem,which) {
			var elements;
			if ( which ) {
				elements = this.bySourceRaw(elem);
			}else {
				elements = this.byTargetRaw(elem);
			}
//			_.bind(func,this);
//			var elements = func(elem);
			if ( _.isUndefined(elements) ){
				return elements;
			}
			return _.chain(elements).filter(function(ee) { 
				return ee.get('type') != 'task_operation';
			}).value();
		},
		bySourceNoTasks: function(elem){
			return this.bySomethingNoTasks(elem,true);
		},
		byTargetNoTasks: function(elem){
			return this.bySomethingNoTasks(elem,false);
		}
		
	});
	
}());
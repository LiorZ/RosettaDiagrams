define(['Backbone','models/DiagramElementCollection','models/IFMover'],function(Backbone,DiagramElementCollection,IFMover) {
	var PaletteElements = DiagramElementCollection.extend({
		add: function(model) {
			if ( model instanceof Array){
				var iterator = function(obj){ return obj.type=='logic'};
				var logic = _.filter(model,iterator);
				if (logic.length == 1 ){
					var new_model = new IFMover(logic[0])
					Backbone.Collection.prototype.add.call(this, new_model);				
				}
				model =_.reject(model,iterator);
				Backbone.Collection.prototype.add.call(this, model);
			}
		},
		url: '/js/rosetta_diagrams/js/json/elements.json',
		comparator: function(element) { 
			return element.get('name');
		} 
		
	});
	
	return PaletteElements;
});
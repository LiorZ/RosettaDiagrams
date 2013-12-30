define(['Backbone','BackboneRelational','models/BaseAttribute','models/globals'],function(Backbone,BackboneRelational,BaseAttribute,globals) {
	var AttributeList = Backbone.Collection.extend({
		model: BaseAttribute,
		initialize:function() {
		},
		byKey: function(key) {
		    var filtered = this.filter(function(attr) {
		      return attr.get("key") == key;
		    });
		    return filtered[0];
		},
		nonEmpty: function() {
			return this.filter(function(attr) {
				return attr.get('value') !='';
			});
		}
	});
	
	globals.AttributeList = AttributeList;
	
	return AttributeList;
});
define(['Backbone','BackboneRelational','models/Attribute','models/globals'],function(Backbone,BackboneRelational,Attribute,globals) {
	var AttributeList = Backbone.Collection.extend({
		model: Attribute,
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
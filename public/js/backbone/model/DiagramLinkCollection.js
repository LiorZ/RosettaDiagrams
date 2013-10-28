define(['models/DiagramLink','models/globals'],function(DiagramLink,model_globals) {
	var DiagramLinkCollection = Backbone.RelationalModel.extend({
		model: DiagramLink,
		getNonTaskTargets: function(){
			var targets = [];
			this.each(function(con) {
				if ( this.get('type') == 'connection' ) {
					targets.push(this.get('target'));
				}
			});
			return targets;
		}
	});
	
	model_globals.DiagramLinkCollection = model_globals;
	return DiagramLinkCollection;
});
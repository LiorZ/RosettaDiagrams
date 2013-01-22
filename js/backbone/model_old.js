

var rdiag = rdiag || {};

rdiag.DiagramConnection = Backbone.Model.extend({ 
	defaults: {
		source: undefined,
		target: undefined,
		type: Joint.dia.uml
	}
});

rdiag.DiagramConnectionCollection = Backbone.Collection.extend({
	model: rdiag.DiagramConnection
});


rdiag.DiagramElement = Backbone.Model.extend({ 
		
	defaults: {
		x:0,
		y:0,
		name: "NewMover",
		canvas: undefined,
		elem: undefined,
	},	
	
});

rdiag.MenuItem = Backbone.Model.extend( {

	defaults: { 
		x: 0,
		y: 0,
		action: "DDD",
		img: undefined,
		diagramElement: undefined
	},
	
});

rdiag.DiagramElementList = Backbone.Collection.extend({
	model: rdiag.DiagramElement
});

var MenuItems = Backbone.Collection.extend({
	model: rdiag.MenuItem
	
});

var elementsInCanvas = new rdiag.DiagramElementList();

rdiag.createDiagramElement = function(params) { 
	var d = new rdiag.DiagramElement(params);
	elementsInCanvas.add(d);
	return d;
};

rdiag.createMenuItem = function(params) { 
	var m = new rdiag.MenuItem(params);
	return m;
}

rdiag.Canvas = Backbone.Model.extend( { 

	defaults: { 
		elements: new rdiag.DiagramElementList(),
		connections: new rdiag.DiagramConnectionCollection(),
		menu: rdiag.createMenuItem(),
	},

});

rdiag.App = Backbone.Model.extend({
	defaults:{
		canvas: new rdiag.Canvas(),
		sourceElement: undefined,
		targetElement: undefined,
		connectionMode: false
	},
	connectionReady: function() {
		var s = this.get('sourceElement');
		return s != undefined;

	},
	
	resetElements: function() {
		this.set('sourceElement',undefined);
		this.set('targetElement',undefined);
	},
	isInConnectionMode: function() {
		return this.get('connectionMode');
	}
});




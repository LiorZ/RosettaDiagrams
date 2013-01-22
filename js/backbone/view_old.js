var rdiag = rdiag || {};
var uml = Joint.dia.uml;

rdiag.AppView = Backbone.View.extend({
  el: '#container',
  canvasView: undefined,
  render: function () {
	this.canvasView.render();
  },
  
  events: { 
	 "click #add_mover": "addDiagramElement",
	 "click #add_connection": "addConnection"
  },
  
  initialize: function() { 
    this.canvasView = new rdiag.CanvasView({model: this.model.get('canvas')});
  },
  toggleConnection: function(obj,connectionType) {
	  m = this.model;
	  if ( m.connectionReady() ) {
		  console.log("I am now connection ready");
		  m.set('targetElement',obj);
		  this.connectNodes(connectionType);
		  m.resetElements();
		  m.set('connectionMode',false);
	  }else { 
		  console.log("Setting source element");
		  m.set('sourceElement',obj);
		  console.log("Source element is now " + this.model.get('sourceElement'));
	  }
  },
  addDiagramElement: function(e) { 
	  console.log("Add mover clicked!");
  },
  
  addConnection: function(e) {
  },
  
  connectNodes: function(connectionType) {
	  var source = this.model.get('sourceElement');
	  var target = this.model.get('targetElement');
	  console.log("Trying to connect " + source + " And " + target);
	  this.canvasView.connectNodes(source,target,connectionType);
  }
});

rdiag.CanvasView = Backbone.View.extend({ 
	el: "#world",
	connectionViewCollection: undefined,
	initialize: function() { 
		this.menuView = new rdiag.MenuItemView({model: this.model.get('menu')});
		this.connectionViewCollection = new rdiag.ConnectionViewCollection();
	},
	render: function() {
		Joint.paper("world", 800, 800);
	},
	addDiagramElement: function(params) { 
		  var modelObj = rdiag.createDiagramElement(params); //add to the model of app....
		  var view = rdiag.createDiagramElementView({model: modelObj});
		  view.render();
	},
	connectNodes: function(node1,node2,connectionType) {
		//node1, node2 are instances of DiagramElementView
		var connectionView = new rdiag.DiagramConnectionView({source: node1, target:node2, connectionType: connectionType});
		this.connectionViewCollection.add(connectionView);
	},
	
	events: { 'click' : 'handleClick'},
	
	handleClick: function(e) { 
	},
	
	showMenu: function()  {
		this.menuView.show();
	}
});
//add register element for all DiagramElements!

rdiag.DiagramElementView = Backbone.View.extend({
	initialize: function() { 
		this.elem = uml.State.create({
			  rect: {x: this.model.get('x'), y: this.model.get('y'), width: 150, height: 100},
			  label: this.model.get('name'),
			  attrs: {
			    fill: "90-#000-green:1-#fff"
			  },
			  shadow: true,
			  actions: {
				inner: ["attribute 1", "value 1", "attribute 2" , "value 2"]
			  }
		});
		
		this.$el = jQuery(this.elem.wrapper.node);
	},
	events: { 'mouseup' : 'toggleConnect'},
	toggleConnect: function(e) { 
		if ( rdiag.appModel.isInConnectionMode() ){
			rdiag.appView.toggleConnection(this,uml);
			console.log("Waiting for the other element...");
		}
	},
	
	connect: function(target,connectionType) {
		this.elem.joint(target, connectionType);
		this.model.addConnection(target);
	},
	
	getRawJoint: function() {
		return this.elem;
	}
});
rdiag.DiagramConnectionView = Backbone.View.extend( {
	rawConnection: undefined,
	source: undefined,
	target: undefined,
	connectionType: undefined,
	initialize: function() {
		this.source = this.options.source;
		this.target = this.options.target;
		this.connectionType = this.options.connectionType;
		this.model = new rdiag.DiagramConnection({source: this.source.model, target: this.target.model});
		
		//creating the actual connection on the canvas:
		this.rawConnection = this.source.getRawJoint().joint(this.target.getRawJoint(), this.connectionType);
	},
	
	getRawConnection: function() { 
		return this.rawConnection;
	}
});
rdiag.MenuItemView = Backbone.View.extend( { 
	
	className: "menuItem",
	initialize: function() {
		$("#world").append(this.el);
	},
	
	show: function() { 
		var elem = this.$el;
		var x = this.model.get('x');
		var y = this.model.get('y');
		elem.css("top",y);
		elem.css("left",x);
		elem.css("display","block");
	}
});

rdiag.createDiagramElementView = function(params) {
	return new rdiag.DiagramElementView(params);
};


rdiag.ConnectionViewCollection = Backbone.View.extend({
    events: {
        // only whole collection events (like table sorting)
        // each child view has it's own events
    },
    collection: undefined,
    initialize: function()
    {
        this._ConnectionViewCollection = {}; // view chache for further reuse
        this.collection = new rdiag.DiagramConnectionCollection();
    },

    render: function()
    {
        // some collection rendering related stuff
        // like appending <table> or <ul> elements
        return this;
    },
    updateRawConnections: function() {
        arr = [];
        for(var cid in this._ConnectionViewCollection){
        	var view = this._ConnectionViewCollection[cid];
            arr.push(view.getRawConnection());
        }
        for(var i=0; i<arr.length; ++i){
        	arr[i].register(arr);
        }
    },
    add: function(v)
    {
        // cache the view
    	this.collection.add(v.model);
        this._ConnectionViewCollection[v.model.cid] = v;
        this.updateRawConnections();
        // single model rendering
        // like appending <tr> or <li> elements
        //MyElementView.render(); 
        console.log("Added a new view to the collection with id " + v.model.cid);
    }
});


rdiag.appModel = new rdiag.App();
rdiag.appView  = new rdiag.AppView({model: rdiag.appModel});

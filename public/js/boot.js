require.config({
  paths: {
    jQuery: '/js/lib/jquery/jquery.min',
    Underscore: '/js/lib/underscore/underscore-min',
    Backbone: '/js/lib/backbone/backbone',
    models:'/js/backbone/model/',
    controllers:'/js/backbone/controllers/',
    views:'/js/backbone/view/',
    BackboneRelational: '/js/lib/backbone-relational/backbone-relational',
    jQueryUI: '/js/lib/jquery-ui/jqueryui',
    prettify: '/js/lib/prettify/prettify',
    Joint: '/js/lib/joint/joint',
    Raphael:'/js/lib/joint/raphael',
    json2:'/js/lib/joint/json2',
    Joint_dia_uml:'/js/lib/joint/joint.dia.uml',
    Joint_dia_org:'/js/lib/joint/joint.dia.org',
    Joint_dia:'/js/lib/joint/joint.dia',
    tablesorter: '/js/lib/jquery-ui/plugins/tablesorter/jquery.tablesorter',
    EasingMenu: '/js/behavior/EasingMenu'
  },

  shim: {
	'Underscore': {
		deps:['jQuery'],
		exports:'_'
	},
	EasingMenu: {
		deps:['jQueryUI'],
		exports:'EasingMenu'
	},
	tablesorter: {
		deps:['jQueryUI'],
		exports:'tablesorter'
	},
	prettify: {
		deps:['jQuery'],
		exports:'prettify'
	},
	jQueryUI: {
		deps:['jQuery'],
		exports:'jQueryUI'
	},
    'Backbone': {
    	deps: ['Underscore', 'jQuery'],
    	exports:'Backbone'
    } ,
    'BackboneRelational':{
    	deps:['Backbone'],
    	exports: 'BackboneRelational'
    },
    'BackboneLocal': {
  	  deps:['Backbone'],
  	  exports: 'BackboneLocal'
    },
    Joint: {
    	deps:['Raphael','json2'],
    	exports:'Joint'
    },
    Joint_dia_org: {
    	deps:['Joint_dia'],
    	exports:'Joint_dia_uml'
    },
    Joint_dia_uml: {
    	deps:['Joint_dia'],
    	exports:'Joint_dia_org'
    },
    Joint_dia:{
    	deps:['Joint'],
    	exports:'Joint_dia'
    },
    'models/Account':['Backbone'],
  }
});

require(['views/appView','models/Diagram','models/globals','models/PaletteElements','Backbone','BackboneRelational','prettify','jQueryUI','Joint','Joint_dia_org','Joint_dia_uml','tablesorter','EasingMenu'], 
		function(appView,Diagram,model_globals,PaletteElements) {
	
	
	Backbone.Relational.store.addModelScope(model_globals);
	var d = new Diagram();
	model_globals.MainDiagram = d;
	model_globals.ActiveDiagram = d;
	var palette = new PaletteElements();
	palette.fetch({update: true, 
		success:function() {
			palette.sort();
			Backbone.sync = function(method, model, options) { };
			new appView({palette:palette}).render();
		},
		error: function() {
			alert("Error loading page - could not load palette");
		}
	});
	
	
	
});
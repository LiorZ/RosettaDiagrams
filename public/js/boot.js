require.config({
  paths: {
    jQuery: 'lib/jquery/jquery.min',
    Underscore: 'lib/underscore/underscore-min',
    Backbone: 'lib/backbone/backbone',
    models:'backbone/model/',
    controllers:'backbone/controllers/',
    views:'backbone/view/',
    BackboneRelational: 'lib/backbone-relational/backbone-relational',
    jQueryUI: 'lib/jquery-ui/jqueryui',
    prettify: 'lib/prettify/prettify',
    Joint: 'lib/joint/joint',
    Raphael:'lib/joint/raphael',
    json2:'lib/joint/json2',
    Joint_dia_uml:'lib/joint/joint.dia.uml',
    Joint_dia_org:'lib/joint/joint.dia.org',
    Joint_dia:'lib/joint/joint.dia',
    tablesorter: 'lib/jquery-ui/plugins/tablesorter/jquery.tablesorter',
    EasingMenu: 'behavior/EasingMenu',
    vkbeautify: 'lib/vkbeautify/vkbeautify.0.99.00.beta'
  },

  shim: {
	'Underscore': {
		deps:['jQuery'],
		exports:'_'
	},
	vkbeautify: {
		deps:['jQuery'],
		exports:'vkbeautify'
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

require(['views/appView','models/Diagram','models/globals','models/PaletteElements','Backbone','BackboneRelational','vkbeautify','prettify','jQueryUI','Joint','Joint_dia_org','Joint_dia_uml','tablesorter','EasingMenu'], 
		function(appView,Diagram,model_globals,PaletteElements) {
	
	Backbone.Relational.store.addModelScope(model_globals);
	var d = new Diagram();
	model_globals.MainDiagram = d;
	model_globals.ActiveDiagram = d;
	
	$.getJSON('/js/rosetta_diagrams/js/json/elements.json',function(models) {
		new appView({palette:models}).render();
	});
//	palette.fetch({update: true, 
//		success:function() {
//			palette.sort();
////			Backbone.sync = function(method, model, options) { };
//			
//		},
//		error: function() {
//			alert("Error loading page - could not load palette");
//		}
//	});
	
});

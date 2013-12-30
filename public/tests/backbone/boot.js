require.config({
    baseUrl: '../../',
    paths: {
        // Testing libs
        'jquery'        : '/js/lib/jquery/jquery.min',
        'underscore'    : '/js/lib/underscore/underscore-min',
        'Backbone'      : '/js/lib/backbone/backbone',
        'mocha'			:'/tests/backbone/mocha',
        BackboneRelational: '/js/lib/backbone-relational/backbone-relational',
        'models'		: '/js/backbone/model/',
        'views'		: '/js/backbone/view/',
        'chai': '/tests/backbone/chai/chai',
        Joint: '/js/lib/joint/joint',
        Raphael:'/js/lib/joint/raphael',
        json2:'/js/lib/joint/json2',
        Joint_dia_uml:'/js/lib/joint/joint.dia.uml',
        Joint_dia_org:'/js/lib/joint/joint.dia.org',
        Joint_dia:'/js/lib/joint/joint.dia'

    },
    shim: {
        Backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        mocha: {
           exports: 'mocha'
        },
        'BackboneRelational':{
        	deps:['Backbone'],
        	exports: 'BackboneRelational'
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
    },
    priority: [
        'jquery',
        'underscore',
        'common'
    ]
});


mocha.setup({
    ui: 'bdd',
    ignoreLeaks: true	
});

var runMocha = function(test,complex,Backbone,BackboneRelational,globals) {
	Backbone.Relational.store.addModelScope(globals);
	Backbone.sync = function(method, model, options){ }
	console = window.console || function() {};
	
	if (window.mochaPhantomJS) { 
		mochaPhantomJS.run(); 
	}
	else
		mocha.run();
};

require([
         '/tests/backbone/basic.js','tests/backbone/complex_scenarios','Backbone','BackboneRelational','models/globals'
       ], runMocha);
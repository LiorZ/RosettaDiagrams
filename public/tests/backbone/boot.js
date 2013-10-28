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
        'chai': '/tests/backbone/chai/chai'

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
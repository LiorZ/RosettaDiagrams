require.config({
  paths: {
    jQuery: '/js/lib/jquery/jquery.min',
    Underscore: '/js/lib/underscore/underscore-min',
    Backbone: '/js/lib/backbone/backbone',
    models:'/js/backbone/model/',
    BackboneRelational: '/js/lib/backbone-relational/backbone-relational',
    jQueryUI: '/js/lib/jquery-ui/jqueryui',
  },

  shim: {
	'Underscore': {
		deps:['jQuery'],
		exports:'_'
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
    'models/Account':['Backbone'],
  }
});

require(['views/HomeView','models/Account'], function(HomeView,Account) {
});
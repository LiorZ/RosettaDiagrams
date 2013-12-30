define(['Backbone','Joint_dia_uml'],function(Backbone,j){
	var view_globals = {
			elementCounter: 0,
			Attributes: {
				'mover':{
					jointObjColor: "90-#000-green:1-#fff",
					codeTemplate: '#xml_movers',
					add_protocol: 'mover_name',
					palette_div:'#movers_menu',
					wiki_address:'wiki/movers.html#'
				},
				'logic':{
					jointObjColor: "90-#000-red:1-#fff",
					codeTemplate: '#xml_movers',
					add_protocol: 'mover_name',
					palette_div:'#logic_menu',
					wiki_address:'wiki/movers.html#'
				},
				'filter':{
					jointObjColor: "90-#000-orange:1-#fff",
					codeTemplate: '#xml_filters',
					add_protocol: 'filter_name',
					palette_div:'#filters_menu',
					wiki_address:'wiki/filters.html#'
				},
				'task_operation': {
					jointObjColor: "90-#000-blue:1-#fff",
					codeTemplate: '#xml_task_operations',
					palette_div: '#task_operations_menu',
					wiki_address:'wiki/task_operations.html#'
				
				},
				'container':{
					jointObjColor: "90-#000-yellow:1-#fff",
					codeTemplate: '#xml_movers',
					palette_div: '#containers_menu'
				},
				'connection':{
					jointObj: Joint.dia.uml.dependencyArrow
				},
				'containment':{
					jointObj: Joint.dia.uml.generalizationArrow
				}
				
			},
			
			ATTR_IN_DIAGRAM_VIEW: 5,
			LENGTH_DIAGRAM_TITLE: 20,
			MENU_TIMEOUT: 2000,
			DIAGRAM_ELEMENT_DEFAULT_WIDTH: 150,
			DIAGRAM_ELEMENT_DEFAULT_HEIGHT: 100,
			DIAGRAM_ELEMENT_SMALL_SCALE_WIDTH: 90,
			DIAGRAM_ELEMENT_SMALL_SCALE_HEIGHT: 60,
			DIAGRAM_CONTAINER_DEFAULT_WIDTH: 300,
			DIAGRAM_CONTAINER_DEFAULT_HEIGHT: 400,
			event_agg:  _.extend({}, Backbone.Events),
	}
	
	return view_globals;
});

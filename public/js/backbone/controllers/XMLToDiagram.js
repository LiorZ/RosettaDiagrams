var app = app || {};
app.xmlToDiagramJSON = function(xml_str) {
	try{ 
		var jsonObj = $.xml2json(xml_str);
	}catch(err) {
		alert("Error rendering diagram, the XML appears to be invalid. please correct it and try again.");
		return undefined;
	}
	return jsonObj;
}

var construct_diagram_json = function(xml_element_json,type) {
	var elem_arr =[];
	_.chain(xml_element_json).keys()
	.each(function(k) {
		var obj = {};
		obj['name'] = k;
		obj['attributes'] =  _.chain(xml_element_json[k]).keys().map(function(elem) { return {key: elem, value: xml_element_json[k][elem]}}).value();
		obj.type = type;
		elem_arr.push(obj);
	}).value();
	return elem_arr;
}

var connection_name_order =function(protocols) {
	var arr = [];
	_.each(protocols.Add,function(add_elem) {
		arr.push(add_elem.mover_name || add_elem.filter_name);
	});
	if ( arr.length == 1 ){
		return arr;
	}
	var edges = [];
	for (var i=1; i<arr.length; ++i) {
		edges.push({sourceId:arr[i-1], targetId:arr[i], type:'connection'});
	}
	return edges;
}

app.extractElementsFromJSON = function(jsonObj) {
	var movers = (_.isObject(jsonObj.MOVERS))?construct_diagram_json(jsonObj.MOVERS,'mover'):[];
	var filters = (_.isObject(jsonObj.FILTERS))?construct_diagram_json(jsonObj.FILTERS,'filter'):[];
	var to = (_.isObject(jsonObj.TASKOPERATIONS))?construct_diagram_json(jsonObj.TASKOPERATIONS,'task_operation'):[];
	return _.union(movers,filters,to);
}

app.createBackboneElements = function(element_array){
	var nesting_map = {};
	_.each(element_array, function(elem) {
		var name_obj = _.findWhere(elem.attributes,{key:'name'});
		var add_obj= _.findWhere(elem.attributes,{key:'Add'});
		if ( _.isUndefined(name_obj) ) {
			alert("Missing name attributes in " + elem.name);
			return;
		}
		var name = name_obj.value;
		
		var bb_elem = new app.DiagramElement(_.omit(elem,'Add'));
		if (!_.isUndefined(add_obj)){
			nesting_map[name]=[];
			nesting_map[name] = {nested_items:add_obj.value, backbone:bb_elem};
		}else {
			nesting_map[name] = {backbone:bb_elem};
		}
	});
	_.chain(nesting_map).keys().each(function(key) {
		var nested_names = nesting_map[key].nested_items;
		if ( !_.isUndefined(nested_names) ){
			console.log("NESTED NAMES");
			console.log(nested_names);
			for (var i=0; i<nested_names.length; ++i){
				var cur_name = nested_names.mover_name || nested_names.filter_name;
				var bb_elem = nesting_map[cur_name];
				nesting_map[key].backbone.get('subdiagram').add_element(bb_elem);
			}
		}else{
			console.log("NESTED ARE UNDEFINED");
			app.MainDiagram.add_element(nesting_map[key].backbone);
		}
	}).value();

}

app.arrangeTOPEdges = function(json) {
	
	var edges = [];
	_.chain(json).each(
			function(elem) {
				if ( elem.type == 'task_operation' || _.isUndefined(elem.attributes) || elem.attributes.length == 0)
					return;
				
				var tasks = _.find(elem.attributes,function(attr) { return attr.key == 'task_operations'});
				if ( _.size(tasks) == 0 ) { return ;}
				var task_values = tasks.value;
				var task_names = task_values.split(',');
				var my_name = _.find(elem.attributes,function(attr){ return attr.key == 'name'}).value;
				_.each(task_names,function(task_name) { edges.push({sourceId: task_name.replace(/\s+/g, ''), targetId:my_name, type:'containment'});});
			});
	return edges;
}

var prepare_nodes_for_dagre = function(elements_arr) {
	_.each(elements_arr, function(elem) {
		if (_.isUndefined(elem.attributes)) {
			alert("Error rendering diagram. Check the name element of " + elem.name);
			return;
		}
		
		var name_hash = _.find(elem.attributes,function(attr) { return attr.key == 'name' })
		if ( _.isUndefined(name_hash) || _.size(name_hash) == 0 ){
			alert("Error rendering diagram. Check the name element of " + elem.name);
			return;
		}
		_.extend(elem,{id: name_hash.value, width:consts.DIAGRAM_ELEMENT_DEFAULT_WIDTH, height: consts.DIAGRAM_ELEMENT_DEFAULT_HEIGHT});
	});
	
}

app.applyDagre = function(edges,nodes) {
	prepare_nodes_for_dagre(nodes);
	console.log(nodes);
	console.log(edges);
	dagre.layout()
    .nodes(nodes)
    .edges(edges)
    .run();
	_.each(nodes,function(node) { node.x = node.dagre.x; node.y = node.dagre.y });
}

app.createConnections = function(edges) {
	if ( _.isUndefined(edges) || edges.length == 0 ) {
		return;
	}
	_.each(edges,function(edge) {
		var first_elem = app.MainDiagram.element_by_name(edge.sourceId);
		var second_elem = app.MainDiagram.element_by_name(edge.targetId);
		if ( _.isUndefined(first_elem) || _.isUndefined(second_elem) ){
			alert("Error creating diagram. Check your task operation references and try again");
			return;
		}
		
		var new_con = {};
		if (edge.type == 'connection') {
			new_con = new app.DiagramConnection({source: first_elem, type: Joint.dia.uml.dependencyArrow, target:second_elem});
		}else if (edge.type='containment'){
			new_con = new app.DiagramContainment({source: first_elem, type: Joint.dia.uml.generalizationArrow, target:second_elem});
		}else {
			alert("Error rendering diagram! Unknown connection type");
			return;
		}
		
		app.MainDiagram.add_connection(new_con);
	});
}

app.getConnections = function(element_json_arr, protocols) {
	var task_edges = app.arrangeTOPEdges(element_json_arr);
	var connection_edges = connection_name_order(protocols);
	var edges = _.union(connection_edges,task_edges);
	return edges;
}

app.XMLToDiagram = function(xml_str){
	var json = app.xmlToDiagramJSON(xml_str);
	var element_json_arr = app.extractElementsFromJSON(json);
	var edges = app.getConnections(element_json_arr,json.PROTOCOLS);
	app.applyDagre(edges,element_json_arr);
	app.createBackboneElements(element_json_arr);
	app.createConnections(edges);
}
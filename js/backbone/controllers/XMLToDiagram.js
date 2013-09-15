var app = app || {};
app.xmlToDiagramJSON = function(xml_str) {
	var jsonObj = $.xml2json(xml_str);
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
	return arr;
}

app.extractElementsFromJSON = function(jsonObj) {
	var movers = construct_diagram_json(jsonObj.MOVERS,'mover');
	var filters = construct_diagram_json(jsonObj.FILTERS,'filter')
	var to = construct_diagram_json(jsonObj.TASKOPERATIONS,'task_operation');
	return _.union(movers,filters,to);
}

app.createBackboneElements = function(element_array){
	_.each(element_array, function(elem) {
		var bb_elem = new app.DiagramElement(elem);
		app.MainDiagram.add_element(bb_elem);
	});
}

app.createConnections = function(order) {
	if ( order.length < 2 ) {
		return;
	}
	var first_elem = app.MainDiagram.element_by_name(order[0]);
	var second_elem = app.MainDiagram.element_by_name(order[1]);
	var new_con = new app.DiagramConnection({source:first_elem,target:second_elem, type:Joint.dia.uml.dependencyArrow});
	app.MainDiagram.add_connection(new_con);
	if ( order.length > 2 ) {
		for(var i=1; i<order.length-1; ++i){
			first_elem = app.MainDiagram.element_by_name(order[i]);
			second_elem = app.MainDiagram.element_by_name(order[i+1]);
			new_con = new app.DiagramConnection({source:first_elem,target:second_elem, type:Joint.dia.uml.dependencyArrow});
			app.MainDiagram.add_connection(new_con);
		}
	}
}

app.XMLToDiagram = function(xml_str){
	var json = app.xmlToDiagramJSON(xml_str);
	var element_json_arr = app.extractElementsFromJSON(json);
	app.createBackboneElements(element_json_arr);
	var arr = connection_name_order(json.PROTOCOLS);
	app.createConnections(arr);
} 
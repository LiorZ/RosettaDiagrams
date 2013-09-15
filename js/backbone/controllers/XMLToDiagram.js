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

app.extractConnectionsFromJSON = function(xml_element,elements) {
	console.log(xml_element);
}

app.extractElementsFromJSON = function(jsonObj) {
	var movers = construct_diagram_json(jsonObj.MOVERS,'mover');
	var filters = construct_diagram_json(jsonObj.FILTERS,'filter')
	var to = construct_diagram_json(jsonObj.TASKOPERATIONS,'task_operation');
	return _.union(movers,filters,to);
}


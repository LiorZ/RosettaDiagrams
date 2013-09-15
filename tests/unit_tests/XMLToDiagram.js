var jsdom = require('jsdom');
var DOMParser = require('xmldom').DOMParser;
var jq = require('jquery');
var should = require('should');
var _ = require('underscore');
var $ = {};
var xml = '<?xml version="1.0" encoding="UTF-8"?>\
	<doc>\
	    <test attr="yops">\
	        <a><span>Hi</span></a>\
	    </test>\
	</doc>';

describe('Testing XMLToDiagram',function() {
	var app = {};
	var xml_str = '';
	var elements = {};
	before(function(done) {
		jsdom.env({
				html: "<html><head></head><body></body></html>",
				scripts: [
				          '../../js/lib/jquery/jquery.min.js',
				          '../../js/lib/underscore/underscore-min.js',
				          "../../js/lib/backbone/backbone.js",
						  "../../js/backbone/model/Attribute.js",
						  "../../js/backbone/model/TaskOAttribute.js",
						  "../../js/backbone/model/InformationMessage.js",
						  "../../js/backbone/model/DiagramElement.js",
						  "../../js/backbone/model/IFMover.js",
						  "../../js/backbone/model/DiagramConnection.js",
						  "../../js/backbone/model/DiagramContainment.js",
						  "../../js/backbone/collections/DiagramElementCollection.js",
						  "../../js/backbone/collections/DiagramConnectionCollection.js",
						  "../../js/backbone/model/Diagram.js",
				          '../../js/lib/jquery/xml2json/xml2json.js',
				          '../../js/backbone/controllers/XMLToDiagram.js'
			],
			done: function(err,window){
				   app = window.app;
				   should.exist(app.DiagramElement);
				   var domparser = new DOMParser();
				   window.$.parseXML =function(xml_doc) { return domparser.parseFromString(xml_doc,'text/xml'); };
				   $ = window.$;
				   done();  
			   }
		});
	});
	
	it("Retrieving XML", function(done) {
		jq.ajax({
            url : "http://localhost:8000/tests/unit_tests/files/test1.xml",
            dataType: "text",
            success : function (data,textStatus) {
            	textStatus.should.eql('success');
            	xml_str.should.not.eql(undefined);
            	xml_str = data;
            	done();
            },
            error:function(err){
            	console.log(err);
            	done(new Error(err));
            }
        });
	});
	
	it("Converting XML To JSON", function() {
		console.log(xml_str);
		var json = app.xmlToDiagramJSON(xml_str);
		var j = _.extend({},json);
		j.should.be.ok;
		j.should.have.property('MOVERS');
		j.should.have.property('FILTERS');
		j.should.have.property('PROTOCOLS');
		j.should.have.property('SCOREFXNS');
		var movers = _.extend({},j.MOVERS);
		movers.should.have.property('DockingProtocol');
		var docking = _.extend({},movers.DockingProtocol);
		docking.should.have.property('name');
		var docking_name = docking.name;
		docking.name.should.eql('element_0');
	});
	
	it("Extracting elements from JSON", function() {
		var json = app.xmlToDiagramJSON(xml_str);
		elements = app.extractElementsFromJSON(json);
		elements.length.should.eql(4);
		_.each(elements,function(elem) {
			_.extend({},elem).should.have.property('attributes');
			_.extend({},elem).should.have.property('type');
		});
		var elem_0 = _.extend({},elements[0]);
		elem_0.should.have.property('name');
		var elem_0_attributes = _.union([],elem_0.attributes);
		elem_0_attributes.length.should.eql(3);
		
	});
	
	it("Constructing links between elements", function() {
	});
});
define(['chai','models/Diagram','models/globals'],function(chai,Diagram,model_globals) {

  var assert = chai.assert;
  var expect = chai.expect;
 
  var globals = {
  };
  
  describe('Testing Models', function() {
    describe('Diagram', function() {
      it("Creation of diagram", function(done) {
    	 globals.diagram = new Diagram();
    	 assert.ok(globals.diagram,"Diagram object created successfully");
    	 expect(globals.diagram.get('elements').size()).to.equal(0);
    	 done();
      });
    });
   describe('DiagramElement',function(){ 
      it("Adding 2 elements to diagram",function(done) {
      	var elements = globals.diagram.get('elements');
      	globals.first_element = elements.create({name:"DockingProtocol", type:'mover'});
      	expect(elements.size()).to.equal(1);
      	assert.ok(globals.first_element.get('diagram'),"Diagram - Element association works");
      	
      	globals.second_element = elements.create({name:"Sasa",type:'filter'});
      	expect(elements.size()).to.equal(2);
      	assert.ok(globals.second_element.get('diagram'),"Diagram - element association works");
      	done();
      });
      
      it("Adding attributes to first element" , function(done) {
    	 globals.first_element.add_attribute("bb","1");
    	 expect(globals.first_element.get('attributes').size()).to.equal(1);
    	 assert.ok(globals.first_element.get('subdiagram'));
    	 done();
      });
      
      it("Trying to connect 2 elements" , function(done) {
    	 globals.first_element.connect_element();
    	 assert.ok(model_globals.pendingConnection,"Temp connection object exists");
    	 globals.second_element.connect_element();
    	 var connections = globals.first_element.get('connections');
    	 expect(connections.size()).to.equal(1);
    	 var connection = connections.at(0);
    	 assert.ok(connection,"Connection object is not null");
    	 assert.ok(connection.get('source'),"Source is defined");
    	 assert.ok(connection.get('target'),"Target is defined");
    	 expect(connection.get('type')).to.equal("connection");
    	 expect(connection.get('source')).to.equal(globals.first_element);
    	 expect(connection.get('target')).to.equal(globals.second_element);
    	 
    	 done();
      });
      
      it("Creating a task operation element", function(done) {
    	  globals.task_operation_element = globals.diagram.create_element({name:'IncludeCurrent', type:'task_operation'});
    	  globals.task_operation_element.connect_element();
     	  assert.ok(model_globals.pendingConnection,"Temp connection object exists");
     	  globals.first_element.connect_element();
     	  var task_connections = globals.task_operation_element.get('connections');
     	  expect(task_connections.size()).to.equal(1);
     	  var con = task_connections.at(0);
     	  expect(con instanceof model_globals.DiagramContainment).to.equal(true);
     	  var attributes = globals.first_element.get('attributes');
     	  var task_attr = attributes.byKey('task_operations');
     	  assert.ok(task_attr,"Task operation attribute exists");
     	  done();
     	  
      });
   });
   
    });
    
  });

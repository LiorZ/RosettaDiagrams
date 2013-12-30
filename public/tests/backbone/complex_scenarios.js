define(['chai','models/Diagram','models/globals'],function(chai,Diagram,model_globals) {

  var assert = chai.assert;
  var expect = chai.expect;
 
  var globals = {
  };
  
  function create_n_elements(n){
	  var obj = {};
	  obj.diagram = new Diagram();
	  for (var i=0;i<n; i++){
		  obj.diagram.create_element({name:"DockingProtocol", type:'mover', attributes:[{key:'name',value:'element_'+i}]});
	  }
	  return obj;
  }

  describe("Complex Scenarios", function() {
	 it("Connection should be deleted when deleting the target", function(done) {
    	 globals.diagram = new Diagram();
    	 assert.ok(globals.diagram,"Diagram object created successfully");
    	 expect(globals.diagram.get('elements').size()).to.equal(0);
    	 
       	var elements = globals.diagram.get('elements');
      	globals.first_element = elements.create({name:"DockingProtocol", type:'mover', attributes:[{key:'name',value:'element_0'}]});
      	expect(elements.size()).to.equal(1);
      	assert.ok(globals.first_element.get('diagram'),"Diagram - Element association works");
      	
      	globals.second_element = elements.create({name:"Sasa",type:'filter', attributes:[{key:'name',value:'element_1'}]});
      	expect(elements.size()).to.equal(2);
      	assert.ok(globals.second_element.get('diagram'),"Diagram - element association works");
    	
      	globals.first_element.connect_element();
      	assert.ok(model_globals.pendingConnection,"Temp connection object exists");
	 	globals.second_element.connect_element();
	 	
	 	var connections = globals.first_element.get('connections');
	 	expect(connections).to.not.be.undefined;
	 	expect(connections.size()).to.eql(1);
	 	
	 	globals.second_element.destroy();
	 	expect(connections.size()).to.eql(0);

	 	done();
	 });
	 
	 it("Ensure proper ordering of elements", function(done) {
		 var test_obj = create_n_elements(4);
		 var d = test_obj.diagram;
		 var e1 = d.get('elements').at(0);
		 var e2 = d.get('elements').at(1);
		 var e3 = d.get('elements').at(2);
		 var e4 = d.get('elements').at(3);
		 
		 //create 1st connection:
		 e3.connect_element();
		 e1.connect_element();
		 
		 //create 2nd connection:
		 e4.connect_element();
		 e2.connect_element();
		 
		 //create 3rd connection:
		 e1.connect_element();
		 e4.connect_element();
		 
		 expect(d.get('elements').size(),4);
		 
		 var first = d.find_first_element_in_diagram();
		 assert.ok(first,"First element is not null or undefinded");
		 
		 expect(first).to.eql(e3);
		 
		 //Check ordering:
		 var order = d.get_ordered_elements();
		 expect(order.length).to.eql(4);
		 
		 expect(order[0]).to.eql(e3);
		 expect(order[1]).to.eql(e1);
		 expect(order[2]).to.eql(e4);
		 expect(order[3]).to.eql(e2);
		 
		 done();
		 
	 });
	 
	 
  });
  

});

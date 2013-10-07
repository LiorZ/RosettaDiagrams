define(['chai','models/Diagram'],function(chai,Diagram) {

  var assert = chai.assert;
  var expect = chai.expect;
 
  var globals = {
  };
  
  describe('Testing Models', function() {
    describe('Diagram', function() {
      it("Creation of diagram", function(done) {
    	 globals.diagram = new Diagram();
    	 assert.ok(globals.diagram,"Diagram object created successfully");
    	 expect(globals.diagram.get('elements').length).to.equal(0);
    	 done();
      });
    });
  });
});
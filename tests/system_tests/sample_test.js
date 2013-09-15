var assert = require('assert'),
    webdriver = require('webdriverjs');


var client = {};

var general_assert = function(err,res) { assert(err==null) };

describe('Simple Diagram Creation', function() {
	this.timeout(99999999);
	before(function(done) {
		client = webdriver.remote({desiredCapabilities:{browserName: 'firefox'}, logLevel:'silent'});
		client.addCommand("moveDiagramElement", function(cssSelector,xoffset,yoffset,callback) {
		    this.getLocation(cssSelector,function(err,location){
		    	assert(err==null);
			    var before_location ={};
		    	before_location=location;
		    	this.moveToObject(cssSelector,function(err,res) {
		    		general_assert(err,res);
		    		this.buttonDown(function(err) {
		    			general_assert(err);
		    			this.moveTo(null,xoffset,yoffset,function(err){
		    				general_assert(err);
		    				this.buttonUp(function(err){
		    					general_assert(err);
		    					this.getLocation(cssSelector,function(err,location_new){ 
		    						assert(err==null); 
		    						assert.equal(location_new.x,before_location.x+xoffset); 
		    						assert.equal(location_new.y,before_location.y+yoffset);
		    						callback(err);
		    				});
		    			});
		    		});
		    	});
		    });
		});
		});
		client.init();
		done();
	});

it('Dragging elements ...', function(done) {
    client.url("http://localhost:8000/app.html")
    	.click('#movers_menu > button:nth-child(6)',general_assert )
    	.getText('#world > svg:nth-child(1) > text:nth-child(5) > tspan:nth-child(1)',function(err,result){assert.equal(result,"AddSidechainConstrai")})
    	.moveDiagramElement("#world > svg:nth-child(1) > rect:nth-child(4)",-150,-150,general_assert)
    	.click('#movers_menu > button:nth-child(7)',general_assert)
    	.moveDiagramElement("#world > svg:nth-child(1) > rect:nth-child(9)",150,150,general_assert)
    	.pause(1000)
    	.call(done);
});

	after(function(done) {
		client.end(done);
	});

});
var express = require('express');
var mongoose = require('mongoose');
var models = require('./models/models');

var app = express();

app.configure(function(){
	console.log("Configuring ... ");
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.limit('1mb'));
	app.use(express.cookieParser());
	app.use(express.session({secret: "KokoTheLoco", store: new MemoryStore()}));
	app.use(generic_error);
	app.use(app.router);
	
	console.log("Connecting to database at address: " + configuration.db_address);
	mongoose.connect('mongodb://localhost/rosetta-diagrams');
});


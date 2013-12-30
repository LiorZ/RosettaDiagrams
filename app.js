var express = require('express');
var mongoose = require('mongoose');
var models = require('./models/models')(mongoose);
var MemoryStore = require('connect').session.MemoryStore;
var passport = require('passport');

var app = express();

var generic_error = function(err, req, res, next) {
	console.log(err);
	res.send(401);
}

app.configure(function(){
	console.log("Configuring ... ");
	app.set('views', __dirname + '/templates');
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.limit('1mb'));
	app.use(express.cookieParser());
	app.use(express.session({secret: "KokoTheLoco", store: new MemoryStore()}));
    app.use(passport.initialize());
    app.use(passport.session());
	app.use(generic_error);
	app.use(app.router);
	mongoose.connect('mongodb://localhost/rosetta-diagrams');
});

var auth = require('./auth')(models,app,passport);


app.get('/',function(req,res,next){
	res.render('index.jade');
});

app.get('/home',auth.auth_user_web, function(req,res,next) {
	res.render('home.jade');
});

app.post('/diagram/list',auth.auth_user_json,function(req,res,next) {
	console.log("Listing all diagrams");
	models.Diagram.find({owner_id:req.user._id}, function(err,diagrams) {
		if (err) {
			res.send({Result:"Error", Message:"Error fetching diagrams"});
		}else {
			console.log(diagrams);
			var return_obj = {
					Result: "OK",
					Records: diagrams
			};
			res.send(return_obj);
		}
	})
});

app.post('/diagram/new',auth.auth_user_json,function(req,res,next) {
	console.log("Creating new diagram");
	var new_diagram = {
			name: req.body.name,
			description: req.body.description,
			owner_id: req.user._id
	}
	var diagram = new models.Diagram(new_diagram);
	diagram.save(function(err,d) {
		if (err){
			console.log("Error creating diagram")
			res.send({Result:"Error", Message:"Error creating diagram"});
		}else {
			var return_obj = {
				Result: "OK",
				Record: d
			}
		console.log("Sending diagram");
		res.send(return_obj);
		}
	})
});

app.listen(8000);
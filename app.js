/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var route_demo = require('./routes/demo');
var route_plant = require('./routes/plant');
var route_message = require('./routes/message');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.configure(function(){
  app.set('port', 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// development only
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ ROUTING ~~~~~~~~~~~~~~~~~~~~~~

// homepage
app.get('/', routes.home);

// original webpage based posting
app.get('/demo/new', route_demo.demo_get);
app.post('/demo/new', route_demo.demo_post);

// messages
app.get('/messages', route_message.get_all_messages);
app.get('/messages/check', route_message.get_messages);
app.get('/messages/:id', route_message.get_message_by_id);
app.post('/messages', route_message.post_message);

// plants
app.get('/plants', route_plant.home);
app.get('/plants/check', route_plant.get_plants);
app.post('/plants', route_plant.post_plant);
app.post('/plants/update/:id', route_plant.update_plant);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ START ~~~~~~~~~~~~~~~~~~~~~~
http.createServer(app).listen(app.get('port'), function(){
  console.log('InMind server listening on port ' + app.get('port'));
});

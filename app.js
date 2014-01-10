/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var route_demo = require('./routes/demo');
var route_plant = require('./routes/plant');
var route_message = require('./routes/message');

var fs = require('fs');
//var http = require('http');
var https = require('https');
var path = require('path');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

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
  /*
  function requireHTTPS(req, res, next) {
      if (!req.secure) {
          return res.redirect(['https://', req.get('host'), req.url].join(''));
      }
      next();
  }
  app.use(requireHTTPS);
  */
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
/*
var httpPort = app.get('port');                 // normally 80
var httpServer = http.createServer(app);
httpServer.listen(httpPort, function(){
  console.log('InMind HTTP server listening on port ' + httpPort);
});
*/

var httpsPort = app.get('port') + 50;           // normally 443
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(httpsPort, function(){
  console.log('InMind HTTPS server listening on port ' + httpsPort);
});

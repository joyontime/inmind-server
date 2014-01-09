/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MessageProvider = require('./messageProvider').MessageProvider;

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

var messageProvider= new MessageProvider('localhost', 27017);

app.get('/', function(req, res){
  messageProvider.findAll(function(error, docs){
      res.send(docs);
  });
})

/*
app.get('/plant/new', function(req, res) {
    res.render('plant_new.jade', { locals: {
        title: 'New Post'
    }
    });
});
*/

app.post('/plant/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

/*
app.get('/plant/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('plant_show.jade',
        { locals: {
            title: article.title,
            article:article
        }
        });
    });
});
*/

app.post('/plant/addComment', function(req, res) {
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/plant/' + req.param('_id'))
       });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('InMind server listening on port ' + app.get('port'));
});


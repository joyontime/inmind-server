/*
 * Demo from original Rolling with tutorial.
 */
var MessageProvider = require('./messageProvider').MessageProvider;
var messageProvider= new MessageProvider('localhost', 27017);

exports.demo_get = function(req, res){
    res.render('plant_new.jade', { locals: {
        title: 'New Post'
    }
    });
};

exports.demo_post = function(req, res){
    messageProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
};

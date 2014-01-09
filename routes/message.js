/*
 * Message related functions
 */
var MessageProvider = require('./messageProvider').MessageProvider;
var messageProvider= new MessageProvider('localhost', 27017);

exports.get_messages = function(req, res){
    messageProvider.findAll(function(error, docs){
        res.send(docs);
    });
  };

exports.post_message = function(req, res){
    res.send("Tried to post a message");
  };

exports.get_message_by_id = function(req, res) {
    messageProvider.findById(req.params.id, function(error, message) {
        res.render('messages_show.jade',
        { locals: {
            title: message.title,
            message:message
        }
        });
    });
  };

/*
app.post('/messages/addComment', function(req, res) {
    messageProvider.addCommentToMessage(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/messages/' + req.param('_id'))
       });
});
*/


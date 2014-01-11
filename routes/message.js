/*
 * Message related functions
 */
var MessageProvider = require('../data/messageProvider').MessageProvider;
var messageProvider= new MessageProvider('localhost', 27017);

exports.get_all_messages = function(req, res){
    messageProvider.findAll(function(error, docs){
      res.json(docs);
    });
  };

exports.get_messages = function(req, res){
    var plants = req.query.plants;
    if( typeof(plants.map)=="undefined")
      plants = [plants];

    plants = plants.map(function(x){
        return +x;
    });
    var pinged_at = new Date(+req.query.pinged_at);
    console.log([req.user.user_id,
      "( is lead:",
      req.user.is_lead,
      ") asked for messages from:", plants,
      "Since:", pinged_at].join(' '));
    messageProvider.checkMessages(
      req.user.user_id,
      plants,
      pinged_at,
      function(error, messages){
        res.json(messages);
      }
    );
  };

exports.get_message_by_id = function(req, res) {
    messageProvider.findById(req.params.id, function(error, message) {
      res.json(message);
    });
  };

exports.post_message = function(req, res){
    messageProvider.save({
      user_id: req.user.user_id,
      text: req.param('text'),
      plant: +req.param('plant'),
      }, function (error, message){
        res.json(message);
      }
    );
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


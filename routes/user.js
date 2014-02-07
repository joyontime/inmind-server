/*
 * User related functions.
 */
var UserProvider = require('../data/userProvider').UserProvider;
var userProvider= new UserProvider('localhost', 27017);

var potd_happy = "What makes you happy?"
var potd_happy2 = "What is something you're thankful for?"
var potd_happy3 = "What are you most looking forward to this week?"
var potd_happy4 = "What is one good thing happened/is going to happen today?"
var potd_happy5 = "What is an activity that makes you feel fulfilled?"

var potd_sad = "What makes you sad?"
var potd_sad2 = "What is something that worries you?"
var potd_sad3 = "What are you most worried about today?"
var potd_sad4 = "What is something you could use help with?"
var potd_sad5 = "What do you do often that you really dislike?"

var potd_neut = "What is on your mind?"
var potd_neut2 = "What is something you have to plan out this week?"
var potd_neut3 = "What do you do to relax?"
var potd_neut4 = "What is something special that is happening this week?"



/**
 * Args:
 *  user
 * Returns:
 *  List of new users
 */
exports.get_users = function(req, res){
  console.log([
    req.user.username,
    "(",
    req.user.user_id,
    "is lead:",
    req.user.is_lead,
    ") asked for users."].join(' '));
  userProvider.checkUsers(
    req.user.user_id,
    function(error, users){
      userProvider.getUser(users, function(result){
        res.json(result);
      });
    }
  );
}

exports.get_IV = function(req, res){
  userProvider.getGroupIV(
    req.user.user_id,
    function(error, IV){
      userProvider.updatePingedAt(
        req.user.user_id,
        function(error, pinged_at){
          IV.server_id = req.user.user_id;
          IV.pinged_at = req.user.pinged_at;
          IV.POTD_happy = potd_happy2;
          IV.POTD_sad = potd_sad2;
          IV.POTD_neut = potd_neut2;
          res.json(IV);
        });
    }
  );
};

function alphanum(input){
  return ( /[^a-zA-Z0-9\d\s']/.test( input ) )
}

exports.post_user = function(req, res){
  alias = req.param("alias");
  group_id = req.param("group_id");
  pass = req.param("password");
  pass2 = req.param("password2");
  username = req.param("username");
  if (pass != pass2){
    res.redirect('/users/nomatch');
  } else if (alphanum(alias)){
    console.log("Bad alias " + alias);
    res.redirect('/users/bad');
  } else if (alphanum(group_id)) {
    console.log("Bad group id " + group_id);
    res.redirect('/users/bad');
  } else if (alphanum(username)){ 
    console.log("Bad username " + username);
    res.redirect('/users/bad');
  } else {
    userProvider.newUser({
      "alias": alias,
      "group_id": group_id,
      "passphrase": pass,
      "user_id": username,
    }, function (error, result){
      userProvider.joinGroup(
        String(result.server_id),
        group_id,
        function(){
          console.log(result);
          res.redirect('/users/success');
        });
    });
  }
};

exports.new_user = function(req, res){
  console.log(req.param('group_id'));
  res.render('user_new.jade', 
    { locals: { title: 'Join InMind' } }
  );
};

exports.success = function(req, res){
  res.send("Success! Go ahead and log in on InMind on your phone.");
};

exports.nomatch = function(req, res){
  res.send("Your passwords didn't match. :( Please go back and try again.");
};

exports.bad = function(req, res){
  res.send("That didn't work. :( Please go back and try again.");
};


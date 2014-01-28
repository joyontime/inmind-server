/*
 * User related functions.
 */
var UserProvider = require('../data/userProvider').UserProvider;
var userProvider= new UserProvider('localhost', 27017);

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
      IV.server_id = req.user.user_id;
      res.json(IV);
    }
  );
};

function alphanum(input){
  return ( /[^a-zA-Z0-9]/.test( input ) )
}

exports.post_user = function(req, res){
  alias = req.param("alias");
  group_id = req.param("group_id");
  pass = req.param("password");
  pass2 = req.param("password2");
  username = req.param("username");
  if (pass != pass2){
    res.redirect('/users/nomatch');
  } else if (alphanum(alias) || alphanum(group_id) || alphanum(username)){ 
    console.log("Bad Input.");
    res.redirect('/users/badinput');
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


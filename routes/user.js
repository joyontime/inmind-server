/*
 * User related functions.
 */
var UserProvider = require('../data/userProvider').UserProvider;
var userProvider= new UserProvider('localhost', 27017);

exports.home = function(req, res){
  res.send("Looking for users?");
  };

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

exports.post_user = function(req, res){
  userProvider.save({
    alias: req.param('alias'),
    username: req.param('username'),
    group_id: req.param('group_id'),
    }, function (error, result){
      res.json(result);
    }
  );
};

exports.get_IV = function(req, res){
  userProvider.getGroupIV(
    req.user.user_id,
    function(error, IV){
      res.json(IV);
    }
  );
};

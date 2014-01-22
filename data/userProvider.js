var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

UserProvider = function(host, port) {
  this.db = new Db('inm-db', new Server(host, port, {auto_reconnect: true}), {safe:true});
  this.db.open(function(){});
};


UserProvider.prototype.getUserCollection= function(callback) {
  this.db.collection('users', function(error, user_col) {
    if( error ) callback(error);
    else callback(null, user_col);
  });
};

UserProvider.prototype.getGroupCollection= function(callback) {
  this.db.collection('groups', function(error, user_col) {
    if( error ) callback(error);
    else callback(null, user_col);
  });
};

// Find a user, given its user_id.
UserProvider.prototype.getUser = function(usr_ids, callback) {
    this.getUserCollection(function(error, user_col) {
      if (error) callback(error)
      else {
      user_ids = []
      for (var i = 0; i<usr_ids.length; i++){
          user_ids[i] = user_col.db.bson_serializer.ObjectID.createFromHexString(usr_ids[i])
      }
      user_col.find({'_id': {$in: user_ids}}).toArray(function(err, res){
        if (error) callback(error)
        else {
          return_obj = [];
          console.log("RESULTS", res);
          for (var i = 0; i <res.length; i++){
            var user_obj = {
              alias: res[i].alias,
              date_joined: res[i].created_at,
              is_lead: res[i].is_lead,
              server_id: res[i]._id,
            }
            return_obj[i] = user_obj;
          }
          console.log("RETURN OBJ", return_obj);
          callback(return_obj);
        }
      });
      }
    });
}
/*
 * Used by the application on refresh.
 * Looks for users that the user should recieve, since the last
 * time they queried.
 */
UserProvider.prototype.checkUsers = function(usr_id, callback) {
    this.getGroupCollection(function(error, group_col) {
      if( error ) callback(error)
      else {
        group_col.findOne({
          'members': {$in: [usr_id]}
        }, function(error, results){
            if( error ) callback(error)
            else {
              callback(null, results.members);
            }
        })
      }
  });
}

/**
 * Saves a new user.
 */
UserProvider.prototype.save = function(user, callback) {
    this.getUserCollection(function(error, user_col) {
      if( error ) callback(error)
      else {
        user.joined_at = new Date();
        user_col.insert([user], function() {
          callback(null, {
            created_at:user.created_at,
            server_id:user._id
            });
        });
      }
    });
};

exports.UserProvider = UserProvider;

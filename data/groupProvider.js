var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

GroupProvider = function(host, port) {
  this.db = new Db('inm-db', new Server(host, port, {auto_reconnect: true}), {safe:true});
  this.db.open(function(){});
};


GroupProvider.prototype.getGroupCollection= function(callback) {
  this.db.collection('groups', function(error, group_col) {
    if( error ) callback(error);
    else callback(null, group_col);
  });
};

GroupProvider.prototype.getGroupCollection= function(callback) {
  this.db.collection('groups', function(error, group_col) {
    if( error ) callback(error);
    else callback(null, group_col);
  });
};

// Find a group, given its group_id.
GroupProvider.prototype.getGroup = function(usr_ids, callback) {
    this.getGroupCollection(function(error, group_col) {
      if (error) callback(error)
      else {
      group_ids = []
      for (var i = 0; i<usr_ids.length; i++){
          group_ids[i] = group_col.db.bson_serializer.ObjectID.createFromHexString(usr_ids[i])
      }
      group_col.find({'_id': {$in: group_ids}}).toArray(function(err, res){
        if (error) callback(error)
        else {
          return_obj = [];
          for (var i = 0; i <res.length; i++){
            var group_obj = {
              alias: res[i].alias,
              date_joined: res[i].created_at,
              is_lead: res[i].is_lead,
              server_id: res[i]._id,
            }
            return_obj[i] = group_obj;
          }
          callback(return_obj);
        }
      });
      }
    });
}
/*
 * Used by the application on refresh.
 * Looks for groups that the group should recieve, since the last
 * time they queried.
 */
GroupProvider.prototype.checkGroups = function(usr_id, callback) {
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
 * Saves a new group.
 */
GroupProvider.prototype.save = function(group, callback) {
    this.getGroupCollection(function(error, group_col) {
      if( error ) callback(error)
      else {
        group.joined_at = new Date();
        group_col.insert([group], function() {
          callback(null, {
            created_at:group.created_at,
            server_id:group._id
            });
        });
      }
    });
};

exports.GroupProvider = GroupProvider;

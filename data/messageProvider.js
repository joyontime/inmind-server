var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

MessageProvider = function(host, port) {
  this.db= new Db('inm-db', new Server(host, port, {auto_reconnect: true}), {safe:true});
  this.db.open(function(){});
};


MessageProvider.prototype.getCollection= function(callback) {
  this.db.collection('messages', function(error, message_collection) {
    if( error ) callback(error);
    else callback(null, message_collection);
  });
};

MessageProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, message_collection) {
      if( error ) callback(error)
      else {
        message_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

MessageProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, message_collection) {
      if( error ) callback(error)
      else {
        message_collection.findOne({_id: message_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

/*
 * Used by the application on refresh.
 * Looks for messages that the user should recieve, since the last
 * time they queried.
 */
MessageProvider.prototype.checkMessages = function(usr_id, plants,
  pinged_at, callback) {
    if (typeof(usr_id) == "undefined"){
      callback(null, "Need user ID.");
    } else {
      this.getCollection(function(error, message_collection) {
        if( error ) callback(error)
        else {
          message_collection.find(
            {'plant': {$in: plants},
            'created_at': {$gte: pinged_at}
            }).toArray(function(error, results){
              if( error ) callback(error)
              else {
                return_obj = []
                for( var i =0;i< results.length;i++ ) {
                  a = {};
                  a.created_at = results[i].created_at;
                  a.plant_id = results[i].plant;
                  a.server_id = results[i]._id;
                  a.text = results[i].text;
                  a.user_id = results[i].user_id;
                  return_obj[i] = a;
                }
                callback(null, return_obj);
              }
          });
        }
      });
    }
};

MessageProvider.prototype.save = function(messages, callback) {
    this.getCollection(function(error, message_collection) {
      if( error ) callback(error)
      else {
        if( typeof(messages.length)=="undefined")
          messages = [messages];

        for( var i =0;i< messages.length;i++ ) {
          message = messages[i];
          message.created_at = new Date();
        }

        message_collection.insert(messages, function() {
          return_obj = []
          for( var i =0;i< messages.length;i++ ) {
            a = {};
            a.created_at = messages[i].created_at;
            a.server_id = messages[i]._id;
            return_obj[i] = a;
          }
          callback(null, return_obj);
        });
      }
    });
};

exports.MessageProvider = MessageProvider;

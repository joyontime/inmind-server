var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

MessageProvider = function(host, port) {
  this.db= new Db('inm-db', new Server(host, port, {auto_reconnect: true}, {}));
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
            {user_id: usr_id}).toArray(function(error, results){
              if( error ) callback(error)
              else callback(null, results)
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
          callback(null, messages);
        });
      }
    });
};

exports.MessageProvider = MessageProvider;

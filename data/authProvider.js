var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

AuthProvider = function(host, port) {
  this.db= new Db('inm-db', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

AuthProvider.prototype.getCollection= function(callback) {
  this.db.collection('users', function(error, auth_collection) {
    if( error ) callback(error);
    else callback(null, auth_collection);
  });
};

AuthProvider.prototype.login = function(user, pass, callback) {
  this.getCollection(function(error, auth_collection) {
    if( error ) callback(error)
    else {
      auth_collection.findOne({"user_id":user}, function(err, res){
        if (res.passphrase == pass) callback(null, user);
        else callback(null, false);
      });
    }
  });
};

exports.AuthProvider = AuthProvider;

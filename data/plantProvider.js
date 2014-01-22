var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

PlantProvider = function(host, port) {
  this.db = new Db('inm-db', new Server(host, port, {auto_reconnect: true}), {safe:true});
  this.db.open(function(){});
};


PlantProvider.prototype.getCollection= function(callback) {
  this.db.collection('plants', function(error, p_col) {
    if( error ) callback(error);
    else callback(null, p_col);
  });
};

/*
 * Used by the application on refresh.
 * Looks for plants that the user should recieve, since the last
 * time they queried.
 */
PlantProvider.prototype.checkPlants = function(usr_id,
  pinged_at, callback) {
    this.getCollection(function(error, p_col) {
      if( error ) callback(error)
      else {
        p_col.find(
          {'shared_with': {$in: [usr_id]},
            'modified_at': {$gte: pinged_at}
        }).toArray(function(error, results){
            if( error ) callback(error)
            else callback(null, results)
      });
      }
    });
};

/**
 * Saves a new plant.
 */
PlantProvider.prototype.save = function(plant, callback) {
    this.getCollection(function(error, p_col) {
      if( error ) callback(error)
      else {
        plant.created_at = new Date();
        plant.modified_at = new Date();
        plant.state = 0;
        p_col.insert([plant], function() {
          callback(null, {
            created_at:plant.created_at,
            server_id:plant._id
            });
        });
      }
    });
};

/**
 * Updates the state of an existing plant.
 */
PlantProvider.prototype.updatePlant = function(id, state, callback) {
    this.getCollection(function(error, p_col) {
      if( error ) callback(error)
      else {
        var one_plant = p_col.update(
          {"_id": p_col.db.bson_serializer.ObjectID.createFromHexString(id)},
          {"state": state,
          "modified_at": new Date(),
          },
          function(){
            callback(null, one_plant)
          });
      }
    });
};

exports.PlantProvider = PlantProvider;

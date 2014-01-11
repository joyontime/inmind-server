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
  this.db.collection('plants', function(error, plant_collection) {
    if( error ) callback(error);
    else callback(null, plant_collection);
  });
};

/*
 * Used by the application on refresh.
 * Looks for plants that the user should recieve, since the last
 * time they queried.
 */
PlantProvider.prototype.checkPlants = function(usr_id,
  pinged_at, callback) {
    this.getCollection(function(error, plant_collection) {
      if( error ) callback(error)
      else {
        plant_collection.find(
          {'shared_with': {$in: [usr_id]},
            'created_at': {$gte: pinged_at}
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
    this.getCollection(function(error, plant_collection) {
      if( error ) callback(error)
      else {
        plant.created_at = new Date();
        plant.status = 0;
        plant_collection.insert([plant], function() {
          callback(null, plant);
        });
      }
    });
};

/**
 * Updates the status of an existing plant.
 */
PlantProvider.prototype.update_plant = function(plant_id, state, callback) {
    this.getCollection(function(error, plant_collection) {
      if( error ) callback(error)
      else {
        var one_plant = plant_collection.update({"_id": plant_id},
          {"status": state},
          function(){
            callback(null, result)
          });
      }
    });
};

exports.PlantProvider = PlantProvider;

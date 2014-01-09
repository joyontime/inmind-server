var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

PlantProvider = function(host, port) {
  this.db = new Db('inm-db', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


PlantProvider.prototype.getCollection= function(callback) {
  this.db.collection('plants', function(error, plant_collection) {
    if( error ) callback(error);
    else callback(null, plant_collection);
  });
};

PlantProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, plant_collection) {
      if( error ) callback(error)
      else {
        plant_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

PlantProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, plant_collection) {
      if( error ) callback(error)
      else {
        plant_collection.findOne({_id: plant_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

/*
 * Used by the application on refresh.
 * Looks for plants that the user should recieve, since the last
 * time they queried.
 */
PlantProvider.prototype.checkPlants = function(usr_id,
  pinged_at, callback) {
    if (typeof(usr_id) == "undefined"){
      callback(null, "Need user ID.");
    } else {
      this.getCollection(function(error, plant_collection) {
        if( error ) callback(error)
        else {
          //TODO (joyc): Currently returns all plants.
          // Filter for plants that have usr_id in shared_with.
          plant_collection.find().toArray(function(error, results){
              if( error ) callback(error)
              else callback(null, results)
        });
        }
      });
    }
};

/**
 * Saves a new plant.
 */
PlantProvider.prototype.save = function(plants, callback) {
    this.getCollection(function(error, plant_collection) {
      if( error ) callback(error)
      else {
        if( typeof(plants.length)=="undefined")
          plants = [plants];

        for( var i =0;i< plants.length;i++ ) {
          plant = plants[i];
          plant.created_at = new Date();
          plant.status = 0;
        }

        plant_collection.insert(plants, function() {
          callback(null, plants);
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

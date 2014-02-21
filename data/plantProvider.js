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
PlantProvider.prototype.checkPlants = function(usr_id, group_id,
  pinged_at, callback) {
    this.getCollection(function(error, p_col) {
      if( error ) callback(error)
      else {
        p_col.find(
          {'group_id': group_id,
          'shared_with': {$in: [usr_id, 'everyone']},
          'modified_at': {$gte: pinged_at}
        }).toArray(function(error, results){
            if( error ) callback(error)
            else {
              return_obj = []
              for( var i =0;i< results.length;i++ ) {
                a = {};
                a.archived = results[i].archived;
                a.color = results[i].color;
                a.created_at = results[i].created_at;
                a.modified_at = results[i].modified_at;
                a.owner = results[i].owner;
                a.passphrase = results[i].passphrase;
                a.server_id = results[i]._id;
                a.salt = results[i].salt;
                a.shared_with = results[i].shared_with;
                a.smiles = results[i].smiles;
                a.status = results[i].state;
                a.title = results[i].title;
                a.type = results[i].type;
                return_obj[i] = a;
              }
              callback(null, return_obj);
            }
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
        if (plant.type == "plant"){
          plant.state = "0";
        } else if (plant.type == "bird"){
          plant.state = "2";
        }
        plant.smiles = "0";
        plant.created_at = new Date();
        plant.modified_at = new Date();
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
PlantProvider.prototype.updatePlant = function(id, archived, smiles, state, callback) {
    this.getCollection(function(error, p_col) {
      if( error ) callback(error)
      else {
        modified_at = new Date();
        p_col.update(
          {"_id": p_col.db.bson_serializer.ObjectID.createFromHexString(id)},
          {$set:
            {"state": state,
            "archived": archived,
            "modified_at": modified_at,
            "smiles": smiles,
            }
          },
          function(){
            callback(null);
          });
        callback(null, {modified_at: modified_at});
      }
    });
};

exports.PlantProvider = PlantProvider;

/*
 * Plant related functions
 */

var PlantProvider = require('../data/plantProvider').PlantProvider;
var plantProvider= new PlantProvider('localhost', 27017);

exports.home = function(req, res){
  res.send("Looking for plants?");
  };


exports.get_all_plants = function(req, res){
    plantProvider.findAll(function(error, docs){
      res.json(docs);
    });
  };

exports.get_plants = function(req, res){
    plantProvider.checkPlants(
      req.param('user_id'),
      req.param('pinged_at'),
      function(error, plants){
        res.json(plants);
      }
    );
  };

exports.get_plant_by_id = function(req, res) {
    plantProvider.findById(req.params.id, function(error, plant) {
      res.json(plant);
    });
  };

exports.post_plant = function(req, res){
    plantProvider.save({
      group_id: req.param('group_id'),
      shared_with: req.param('shared_with'),
      title: req.param('title'),
      salt: req.param('salt'),
      passphrase: req.param('passphrase'),
      }, function (error, plant){
        res.json(plant);
      }
    );
  };

exports.update_plant = function(req, res){
    plantProvider.updatePlant(req.params.id,
      req.param('state'),
      function(err, plant){
        res.json("Success!");
    });
  };





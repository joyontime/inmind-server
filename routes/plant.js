/*
 * Plant related functions
 */

var PlantProvider = require('../data/plantProvider').PlantProvider;
var plantProvider= new PlantProvider('localhost', 27017);

exports.home = function(req, res){
  res.send("Looking for plants?");
  };

/**
 * Args:
 *  user
 *  pinged_at
 * Returns:
 *  List of new plants
 */
exports.get_plants = function(req, res){
  var pinged_at = new Date(+req.query.pinged_at);
  console.log([
    req.user.username,
    "(",
    req.user.user_id,
    "is lead:",
    req.user.is_lead,
    ") asked for plants.",
    "Since:", pinged_at].join(' '));
  plantProvider.checkPlants(
    req.user.user_id,
    pinged_at,
    function(error, plants){
      res.json(plants);
    }
  );
};

exports.post_plant = function(req, res){
  console.log(req.param('shared_with'));
  plantProvider.save({
    archived: false,
    color: req.param('color'),
    group_id: req.user.group_id,
    owner: req.user.user_id,
    passphrase: req.param('passphrase'),
    salt: req.param('salt'),
    shared_with: JSON.parse(req.param('shared_with')),
    title: req.param('title'),
    }, function (error, plant){
      res.json(plant);
    }
  );
};

exports.update_plant = function(req, res){
  console.log([
    req.user.username,
    "(",
    req.user.user_id,
    "is lead:",
    req.user.is_lead,
    ") wants to update: ",
    req.param('id'),
    "to",
    req.param('state')].join(' '));
    plantProvider.updatePlant(
      req.param('id'),
      req.param('archived')=='true',
      +req.param('state'),
      function(err, plant){
        res.json(plant);
    });
};

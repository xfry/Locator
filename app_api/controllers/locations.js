//app_api/controllers/locations.js

//locations controllers
module.exports.locationCreate = function(req, res) {
  res.status(200);
  res.json({"status": "success"});
}

module.exports.locationsListByDistance = function (req, res){
  res.status(200);
  res.json({"status": "success"});
}
module.exports.locationsCreate = function (req, res){}
module.exports.locationsReadOne = function (req, res){}
module.exports.locationsUpdateOne = function (req, res){}
module.exports.locationsDeleteOne = function (req, res){}

//locations reviews controllers
module.exports.reviewsCreate = function(req, res) {}
module.exports.reviewsReadOne = function(req, res) {}
module.exports.reviewsUpdateOne = function(req, res) {}
module.exports.reviewsDeleteOne = function(req, res) {}
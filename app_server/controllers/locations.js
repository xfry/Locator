//app_server/controllers/locations.js

module.exports.homeList = function(req, res) {
  res.render('locations-list', {title: 'Inicio'});
}

module.exports.locationInfo = function(req, res) {
  res.render('index', {title: 'Información de Ubucación'});
}

module.exports.addReview = function(req, res) {
  res.render('index', {title: 'Agregar sugerencia'});
}
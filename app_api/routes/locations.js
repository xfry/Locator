//app_api/routes/locations.js

var ctrl = require('../controllers/locations');

module.exports = function(app) {
  //locations routes
  app.route("/locations")
    .post(ctrl.locationsCreate)
    .get(ctrl.locationsListByDistance);

  app.route("/locations/:locationid")
    .get(ctrl.locationsReadOne)
    .put(ctrl.locationsUpdateOne)
    .delete(ctrl.locationsDeleteOne);

  /* this is the old way to do that
  app.get('/api/locations', ctrl.locationsListByDistance);
  app.post('/api/locations', ctrl.locationsCreate);
  app.get('/api/locations/:locationid', ctrl.locationsReadOne);
  app.put('/api/locations/:locationid', ctrl.locationsUpdateOne);
  app.delete('/api/locations/:locationid', ctrl.locationsDeleteOne);*/

  //reviews routes
  app.route("/locations/:locationid/reviews")
    .post(ctrl.reviewsCreate);
  app.route("locations/:locationid/reviews/:reviewid")
    .get(ctrl.reviewsReadOne)
    .put(ctrl.reviewsUpdateOne)
    .delete(ctrl.reviewsDeleteOne);
  
  /*this is the old way to do that
  app.post('/api/locations/:locationid/reviews', ctrl.reviewsCreate);
  app.get('/api/locations/:locationid/reviews/:reviewid', ctrl.reviewsReadOne);
  app.put('/api/locations/:locationid/reviews/:reviewid', ctrl.reviewsUpdateOne);
  app.delete('/api/locations/:locationid/reviews/:reviewid', ctrl.reviewsDeleteOne);*/
}
//app_api/controllers/locations.js

//includeing model
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var Rev = mongoose.model('Review');

var theEarth = (function(){
  var earthRadius = 6371; //en millas es 3959

  var getDistanceFromRads = function(rads){
    return parseFloat(rads * earthRadius);
  };
  var getRadsfromDistance = function(distance){
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsfromDistance: getRadsfromDistance
  };
})();

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

//locations controllers, crear ubicacion
//crear una nueva ubicacion
module.exports.locationsCreate = function(req, res) {
  console.log("Entro al metodo");
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    },{
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
    }, function(err, location) {
    if (err) {
      sendJSONresponse(res, 400, {message: err});
    } else {
      sendJSONresponse(res, 201, {message: "Se hizo la tarea"});
    }
  });
  console.log("Salio del metodo");
};

module.exports.locationsListByDistance = function (req, res){
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  }
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsfromDistance(20),
    num: 10
  }
  if(!lng || !lat){
    sendJSONresponse(res, 404, {
      "message": "los parametros lng y lat son requeridos en la url"
    });
    return;
  }
  Loc.geoNear(point, geoOptions, function(err, result, stats){
    var locations = [];
    result.forEach(function(doc){
      locations.push({
        distance: theEarth.getDistanceFromRads(doc.dis),
        name: doc.obj.name,
        address: doc.obj.address,
        rating: doc.obj.ratting,
        facilities: doc.obj.facilities,
        _id: doc.obj._id
      });
    });
    sendJSONresponse(res, 200, locations);
  });
};

//Leer una ubicacion
module.exports.locationsReadOne = function (req, res){
  if(req.params && req.params.locationid){
    Loc
    .findById(req.params.locationid)
    .exec(function(err, location){
      if(!location){
        sendJSONresponse(res, 404, 
          {"message": "ubicacion no encontrada"}
        );
        return;
      }else if(err) {
        sendJSONresponse(res, 404, err);
        return;
      }
      sendJSONresponse(res, 200, location);
    });
  } else{
    sendJSONresponse(res, 404, {
    "message": "no hay una peticion de una ubicacion"
    });
  }
}

module.exports.locationsUpdateOne = function (req, res){
  if (!req.params.locationid) {
    sendJSONresponse(res, 404, {'message': "You have not a location tu update"});
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -ratings')
    .exec( function(err, location) {
      if (!location) {
        sendJSONresponse(res, 404, {"message": "you have not a locationid"});
        return;
      }else if (err) {
        sendJSONresponse(res, 404, err);
        return;
      }
      location.name = req.body.name,
      location.address = req.body.address,
      location.facilities = req.body.facilities.split(","),
      location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)],
      location.openingTimes = [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1,
      },{
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2,
      }];
      location.save(function(err, location) {
        if(err){
          sendJSONresponse(res, 404, err);
        }else{
          sendJSONresponse(res, 200, location);
        }
      });
    });
};

module.exports.locationsDeleteOne = function (req, res){
  var locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findByIdAndRemove(locationid)
      .exec(function (err, location) {
        if (err) {
          sendJSONresponse(res, 404, err);
          return;
        }
        sendJSONresponse(res, 204, null);
      });
  } else {
    sendJSONresponse(res, 404, {
      "message": "No hay locationid"
    });
  }
  //algunas veces es mejor encontrar el documento y hacer algo con el
  //antes de eliminarlo
  /*Loc
    .findById(locationid)
    .exec(
      function (err, location) {
        // Do something with the document
        Loc.remove(function(err, location){
          // Confirm success or failure
        });
      }
    );*/
};

//locations reviews controllers

//calculing and update the average rating
var doSetAverageRating = function(location) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0){
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for(i = 0; i < reviewCount; i++){
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function(err) {
      if(err){
        console.log('Uups: ' + err);
      }else{
        console.log("El rating ha sido actualizado a: " + ratingAverage);
      }
    });
  }
};

var updateAverageRating = function(location) {
  Loc
    .findById(location)
    .select("rating reviews")
    .exec(function(err, location){
      if(!err){
        doSetAverageRating(location);
      }
    });
};
var doAddReview = function( req, res, location) {
  if(!location){
    sendJSONresponse(res, 404, "you have not a location yet");
  }else{
    location.reviews.push({
      author: {
        displayName: req.body.author
      },
      ratting: req.body.rating,
      reviewText: req.body.reviewText
    });
    //guardar los cambios realizados en la ubicacion
    location.save(function (err, location) {
      var thisReview;
      if(!err){
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        sendJSONresponse(res, 201, thisReview);
      }else{
        sendJSONresponse(res, 404, err);
      }
    });
  }
}
module.exports.reviewsCreate = function(req, res) {
  //creando review
  if(req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .select("reviews")
      .exec(
        function(err, location){
          if(err){
            sendJSONresponse(res, 404, err);
          }else{
            doAddReview(req, res, location);
          }
      });
  }else {
    sendJSONresponse(res, 404, {
      "message": "No se encontro la Location espesificada"
    });
  }
}

module.exports.reviewsReadOne = function(req, res) {
  if(req.params && req.params.locationid && req.params.reviewid){
    Loc
    .findById(req.params.locationid)
    .select('name reviews')
    .exec(function(err, location){
      var response, review;
      if(!location){
        sendJSONresponse(res, 404, 
          {"message": "ubicacion no encontrada"}
        );
        return;
      }else if(err) {
        sendJSONresponse(res, 404, err);
        return;
      }
      if (location.reviews && location.reviews.length > 0){
        review = location.reviews.id(req.params.reviewid);
        if(!review) {
          sendJSONresponse(res, 404, 
            {"message": "review no encontradosx", review: review}
          );
        }else{
          response = {
            location: {
              name: location.name,
              id: location.id
            },
            review: review,
            prueba: "Esta es la prueba"

          };
          sendJSONresponse(res, 200, response);
        }
      } else {
        sendJSONresponse(res, 404, 
          {"message": "review no encontrados", review: review}
        );
      }
    });
  } else{
    sendJSONresponse(res, 404, {
    "message": "no hay una peticion de una ubicacion ni de reviews"
    });
  }
}
module.exports.reviewsUpdateOne = function(req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJSONresponse(res, 404, {
      "message": "no hay una peticion de una ubicacion ni de reviews"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(function(err, location) {
      var thisReview;
      if (!location) {
        sendJSONresponse(res, 404, {"message": "Location no encontrada"});
        return;
      }else if(err) {
        sendJSONresponse(res, 404, err);
        return;
      }
      if (location.reviews && location.reviews.length > 0) {
        thisReview = location.reviews.id(req.params.reviewid);
        if (!thisReview) {
          sendJSONresponse(res, 404, {"message": "reviewid no encontrado"});
        } else {
          thisReview.author.displayName = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save(function(err, location) {
            if (err) {
              sendJSONresponse(res, 404, err);
            } else {
              updateAverageRating(location._id);
              sendJSONresponse(res, 200, thisReview);
            }
          });
        }
      } else {
        sendJSONresponse(res, 404, {
          "message": "No se actualizo el review"
        });
      }
    });
}
module.exports.reviewsDeleteOne = function(req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJSONresponse(res, 404, {
      "message": "no hay una peticion de una ubicacion ni de reviews"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec( function(err, location) {
      if (!location) {
        sendJSONresponse(res, 404, {
          "message": "no se encontro locationid"
        });
        return;
      } else if (err) {
        sendJSONresponse(res, 404, err);
        return;
      }
      if (location.reviews && location.reviews.length > 0) {
        if(!location.reviews.id(req.params.reviewid)){
          sendJSONresponse(res, 404, {
            "message": "reviewid no fue encontrado"
          });
        } else {
          location.reviews.id(req.params.reviewid).remove();
          location.save(function (err) {
            if (err) {
              sendJSONresponse(res, 204, err);
            } else {
              updateAverageRating(location._id);
              sendJSONresponse(res, 204, null);
            }
          });
        }
      } else {
        sendJSONresponse(res, 404, {
          "message": "No se pudo borrar el Review"
        });
      }
    });
}
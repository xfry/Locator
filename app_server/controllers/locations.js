//app_server/controllers/locations.js
var request = require('request');

var apiOptions = {
  server: "http://localhost:3000"
};

if(process.NODE_ENV === 'production') {
  apiOptions.server = "http://stark-springs-3239.herokuapp.com/";
}
//mostrar datos en home
var renderHomepage = function(req, res, responseBody) {
  res.render('locations-list', {
    title: 'Locator, consigue un lugar con Wi-Fi',
    pageHeader: {
      title: 'Locator',
      strapLine: 'Encuentra un lugar con Wi-Fi a tu alrededor'
    },
    sidebar: "Buscar lugares con wifi? locator te ayuda a encontrar estos lugares, ademas de cafeterias, galleterias, heladerias, dejanos ayudarte y escribe lo que estas buscando",
    locations: responseBody
  });
};

module.exports.homeList = function(req, res) {
  var requestOptions, path;
  path = "/api/locations";
  requestOptions = {
    url: apiOptions.server + path,
    method : "GET",
    json : {},
    qs : {
      lng : -0.7992599,
      lat : 51.378091,
      maxDistance : 20
    }
  };

  request(requestOptions, function (err, response, body) {
    var i, data;
    data = body;
    for (i = 0; i < data.length; i++) {
      data[i].distance = _formatDistance(data[i].distance);
    }
    renderHomepage(req,res, data);
  });

  var _formatDistance = function (distance) {
    var numDistance, unit;
    if (distance > 1) {
      numDistance = parseFloat(distance).toFixed(1);
      unit = 'Km';
    } else {
      numDistance = parseInt(distance * 1000, 10);
      unit = 'm';
    }
    return numDistance + unit;
  };
};

module.exports.locationInfo = function(req, res) {
  res.render('location-info', {
    title: 'Cafeterias',
    pageHeader: {title: 'Juan Valdez'},
    callToAction: "El cafe de Juan valdes esta en Locator porque es un lugar con acceso a wifi y espacio comodo para los visitantes setarse y disfrutar",
    location: {
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: ['Licores', 'Comida', 'Lugares con wifi'],
      coords: {lat: 51.455041, lng: -0.9690884},
      openingTimes: [{
        days: 'Lunes - Viernes',
        opening: '7:00am',
        closing: '7:00pm',
        closed: false
      },{
        days: 'Sabados',
        opening: '8:00am',
        closing: '5:00pm',
        closed: false
      },{
        days: 'Domingos',
        closed: true
      }],
      reviews: [{
        author: 'Fredye',
        rating: 5,
        timestamp: '16 Agosto 2014',
        reviewText: 'Maunifica animas meas! Que gran lugar.'
      },{
        author: 'Raizza',
        rating: 4,
        timestamp: '14 Noviembre 2014',
        reviewText: 'Disfrute de un muy buen cafe con mi novio :D.'
      }]
    }
  });
}

module.exports.addReview = function(req, res) {
  res.render('location-review-form', {
    title: 'Agregar Analisis',
    pageHeader: {title: 'Revisando Analisis de Juan Valdez'},
    user: {
      displayName: "Fredy Andrade"
    }
  });
}
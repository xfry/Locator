//app_server/controllers/locations.js

module.exports.homeList = function(req, res) {
  res.render('locations-list', {
    title: 'Locator, consigue un lugar con Wi-Fi',
    pageHeader: {
      title: 'Locator',
      strapLine: 'Encuentra un lugar con Wi-Fi a tu alrededor'
    },
    sidebar: "Buscar lugares con wifi? locator te ayuda a encontrar estos lugares, ademas de cafeterias, galleterias, heladerias, dejanos ayudarte y escribe lo que estas buscando",
    locations: [{
      name: 'Juan Valdez',
      address: 'Medellin, calle 10 #47-22',
      rating: 3,
      facilities: ['Bares', 'Restaurantes', 'Wi-fi'],
      distance: '100m'
    },{
      name: 'Mariana Food',
      address: 'Medellin, cra 40 #47-54',
      rating: 4,
      facilities: ['Bares', 'Restaurantes', 'Wi-fi'],
      distance: '200m'
    },{
      name: 'Tuchis',
      address: 'Medellin, cra 41 #48-55',
      rating: 4,
      facilities: ['Bares', 'Restaurantes', 'Wi-fi'],
      distance: '250m'
    }]
  });
}

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
var mongoose = require('mongoose');

//=================================================
//            Definiendo Esquemas
//=================================================
//Esquema anidado
var openingTimeSchema = new mongoose.Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, required: true}
});
//agregando esquema de calificaciones
var reviewSchema = new mongoose.Schema({
  author: {
    displayName: String,
  },
  rating: {type: Number, "default": 0, min: 0, max: 5},
  reviewText: String,
  createdOn: {type: Date, "default": Date.now}
});
//Creando esquema mongoose y anidando un esquema a este
var locationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  facilities: [String],
  coords: {type: [Number], index: '2dsphere', required: true},
  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema],
});
//===============Fin de Esquemas===================

//=================================================
//            Definicion de Modelos
//=================================================

mongoose.model('Location', locationSchema);
mongoose.model('Review', reviewSchema);
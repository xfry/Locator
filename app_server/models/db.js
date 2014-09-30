//models db.js
var mongoose = require("mongoose");
var readLine = require("readline");

//Emitir signos de SIGINT permitiendo capturar y
//terminar cualquier cosa antes de terminar el proceso
if(process.platform === "win32"){
  var r1 = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  r1.on("SIGINT", function(){
    process.emit("SIGINT");
  });
}//end SIGINT

//direccion de la base de datos bdURI
var dbURI = 'mongodb://localhost/Locator';
//verificar si es produccion o desarrollo
if(process.env.NODE_ENV === 'production'){
  dbURI = process.env.MONGOLAB_URI;
}
mongoose.connect(dbURI);//conectando a la aplicacion


mongoose.connection.on('connected', function(){
  console.log('Mongoose esta conectado en: ' + dbURI);
});
mongoose.connection.on('error', function(err){
  console.log("La coneccion ha mongoose fallo: " + err);
});
mongoose.connection.on('disconnected', function(){
  console.log("Desconectado de la base de datos...")
});

//capturando finalizacion de conecciones en UNIX
var gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function(){
    console.log("Finalizada coneccion a db, a traves de: " + msg);
    callback();
  });
}

process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.once('SIGINT', function() {
  gracefulShutdown('Aplicacion cerrada', function () {
    process.exit(0);
  });
});

process.once('SIGTERM', function() {
  gracefulShutdown('Aplicacion cerrada', function () {
    process.exit(0);
  });
});

require('./locations');
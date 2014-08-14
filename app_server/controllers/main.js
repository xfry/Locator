//controller/index

//GET pagina Acerca de.
module.exports.about = function(req, res) {
  res.render('index', { title: 'Acerca de.' });
}

//GET pagina registrarse.
module.exports.signin = function(req, res) {
  res.render('index', { title: 'Registro' });
}
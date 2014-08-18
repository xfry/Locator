//controller/index

//GET pagina Acerca de.
module.exports.about = function(req, res) {
  res.render('generic-text', { title: 'Acerca de.' });
}

//GET pagina registrarse.
module.exports.signin = function(req, res) {
  res.render('signin-index', { title: 'Registro' });
}
//controller/index

//GET pagina Acerca de.
module.exports.about = function(req, res) {
  res.render('generic-text', {
    title: 'Acerca de.',
    content: "Locator Locator fue creado para ayudar a las personas a encontrar un lugar en el cual sentarse a trabajar y tomar una taza de cafe en sitios con internet.\n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed lorem acnisi dignissim accumsan.\n"
  });
}

//GET pagina registrarse.
module.exports.signin = function(req, res) {
  res.render('signin-index', { title: 'Registro' });
}
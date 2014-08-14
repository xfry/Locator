//routes/main.js
var ctlr = require("../app_server/controllers/main");

/* GET home page. */
module.exports = function(router){
  router.get("/about", ctlr.about);
  router.get("/signin", ctlr.signin);
};
//routes/index

module.exports = function(router){
  require("./main")(router);
  require("./locations")(router);
};
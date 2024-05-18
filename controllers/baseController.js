const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  ///req.flash('Home Page Welcome')
  res.render("index", {title: "Home", nav})
}

baseController.triggerError = function(req, res, next) {
  next(new Error('Intentional error'));
}

module.exports = baseController
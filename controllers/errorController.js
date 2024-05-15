const Util = require("../utilities/");
const errorController = {};

errorController.showErrorPage = async function (req, res, next, status) {
  try {
    const errorContent = await Util.buildErrorContent(status);
    let nav = await Util.getNav();
    res.status(parseInt(status)).render("./error", { 
      status, 
      content: errorContent, 
      title: status + " Error",
      nav,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = errorController;
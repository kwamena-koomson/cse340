const utilities = require("../utilities/")
const errorController = {}

errorController.generateError = (req, res, next) => {
    throw new Error('Intentional error!')
}

module.exports = errorController
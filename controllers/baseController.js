const utilities = require("../utilities/"); 
const baseController = {}; 

// Controller function to render the home page
baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav(); 
    // Rendering the home page template with title and navigation data
    res.render("index", {title: "Home", nav});
    // Adding a flash message (not displayed since it's after the response is sent)
    req.flash("notice", "This is a flash message.");
}

module.exports = baseController; 

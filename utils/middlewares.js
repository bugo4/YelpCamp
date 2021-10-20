const CampgroundModel = require("../models/campground")

// User middleware

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl)
        req.session.refferrerUrl = req.originalUrl
        req.flash("error", "You must login first!")
        return res.redirect("/login");
    }
    next()
}

// Campground middleware
async function isAuthor (req, res, next) {
    const {id} = req.params;
    const campground = await CampgroundModel.findById(id)
    console.log("isAuthor: verifying...")
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You are not the author of the campground!")
        console.log("Not the author...")
        return res.redirect(`/camps/${id}`)
    }
    next();
}

module.exports.isAuthor = isAuthor 



module.exports.isLoggedIn = isLoggedIn;
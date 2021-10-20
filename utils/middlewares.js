const CampgroundModel = require("../models/campground")
const Reviewmodel = require("../models/review")

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

async function isReviewAuthor (req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Reviewmodel.findById(reviewId)
    console.log("isReviewAuthor: verifying...")
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You are not the author of the review!")
        console.log("Not the author of the review...")
        return res.redirect(`/camps/${id}`)
    }
    next();
}

module.exports.isAuthor = isAuthor 
module.exports.isReviewAuthor = isReviewAuthor 



module.exports.isLoggedIn = isLoggedIn;
function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl)
        req.session.refferrerUrl = req.originalUrl
        req.flash("error", "You must login first!")
        return res.redirect("/login");
    }
    next()
}

module.exports.isLoggedIn = isLoggedIn;
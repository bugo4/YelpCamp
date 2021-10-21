const UserModel = require("../models/user")

module.exports.renderUserLogin = (req, res) => {
    res.render("login.ejs")
}

module.exports.loginUser = async (req, res) => {
    const ReffererUrl = req.session.refferrerUrl || "/camps"
    console.log(ReffererUrl)
    const {username, password} = req.body;
    req.flash('success', "welcome back!")
    console.log(`user logged in! :0`)
    console.log(`username: ${username}, password: ${password}`)
    delete req.session.refferrerUrl
    res.redirect(ReffererUrl)
}

module.exports.renderRegister = (req, res) => {
    res.render("register.ejs")
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const {username, password, email} = req.body
        const user = new UserModel({email, username})
        const registeredUser = await UserModel.register(user, password)
        const ReffererUrl = req.session.refferrerUrl || "/camps"
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash("success", "registered successfully!")
            console.log("registered successfully!")
            res.redirect(ReffererUrl)    
            delete req.session.refferrerUrl
            return;
        })
    } catch(e) {
        req.flash("error", e.message)
        console.log(e.message)
        res.redirect("/register")
    }
    
}

module.exports.logoutUser = (req, res) => {
    req.logout()
    req.flash("success", "logged out... bye bye :(")
    return res.redirect("/login")
}
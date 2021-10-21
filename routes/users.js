const express = require("express")
const router = express.Router()

const UserModel = require("../models/user")


const passport = require("passport")
const LocalStrategy = require("passport-local") // Save locally
const {isLoggedIn} = require("../utils/middlewares") 

// Authorization
router.get("/login", (req, res) => {
    res.render("login.ejs")
})
router.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) , async (req, res) => {
    const ReffererUrl = req.session.refferrerUrl || "/camps"
    console.log(ReffererUrl)
    const {username, password} = req.body;
    req.flash('success', "welcome back!")
    console.log(`user logged in! :0`)
    console.log(`username: ${username}, password: ${password}`)
    delete req.session.refferrerUrl
    res.redirect(ReffererUrl)
})

router.get("/register", (req, res) => {
    res.render("register.ejs")
})

router.post("/register", async (req, res, next) => {
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
    
})

router.get("/logout", isLoggedIn, (req, res) => {
    req.logout()
    req.flash("success", "logged out... bye bye :(")
    return res.redirect("/login")
})

module.exports = router;
const express = require("express")
const router = express.Router()

const UserModel = require("../models/user")

const users = require("../controllers/users")

const passport = require("passport")
const LocalStrategy = require("passport-local") // Save locally
const {isLoggedIn} = require("../utils/middlewares") 

// Authorization
router.route("/login")
    .get(users.renderUserLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) , users.loginUser)

router.route("/register")
    .get(users.renderRegister)
    .post(users.registerUser)

router.get("/logout", isLoggedIn, users.logoutUser)

module.exports = router;
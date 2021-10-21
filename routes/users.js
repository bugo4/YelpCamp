const express = require("express")
const router = express.Router()

const UserModel = require("../models/user")

const users = require("../controllers/users")

const passport = require("passport")
const LocalStrategy = require("passport-local") // Save locally
const {isLoggedIn} = require("../utils/middlewares") 

// Authorization
router.get("/login", users.renderUserLogin)
router.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) , users.loginUser)

router.get("/register", users.renderRegister)

router.post("/register", users.registerUser)

router.get("/logout", isLoggedIn, users.logoutUser)

module.exports = router;
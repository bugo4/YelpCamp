const express = require("express")
const router = express.Router();

const CampGroundModel = require("../models/campground")
const {isLoggedIn, isAuthor} = require("../utils/middlewares") 

const passport = require("passport")
const LocalStrategy = require("passport-local") // Save locally

const campgrounds = require("../controllers/camps")


// Show all camps
router.route("/")
    .get(isLoggedIn, campgrounds.index)
    .post(isLoggedIn, campgrounds.postNewCamp)

// New
// Create new camps page - get
router.get("/new", isLoggedIn, campgrounds.newCampForm)

// Read
// Get a specific camp - get
router.route("/:id")
    .get(isLoggedIn, campgrounds.getCamp)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground) // Delete

// Update & Edit
// Edit
// Get the edit form to update a camp
router.route("/edit/:id")
    .get(isLoggedIn, isAuthor, campgrounds.getEditForm) // Get the edit camp page
    .put(isLoggedIn, isAuthor, campgrounds.updateCampground) // Update



module.exports = router;
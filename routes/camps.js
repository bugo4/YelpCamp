const express = require("express")
const router = express.Router();

const CampGroundModel = require("../models/campground")
const {isLoggedIn, isAuthor} = require("../utils/middlewares") 

const passport = require("passport")
const LocalStrategy = require("passport-local") // Save locally

const campgrounds = require("../controllers/camps")


// get
// Show all camps
router.get("/", isLoggedIn, campgrounds.index)

// Create & New
// New
// Create new camps page - get
router.get("/new", isLoggedIn, campgrounds.newCampForm)
// Create
// Parse create new campground - post
router.post("/", isLoggedIn, campgrounds.postNewCamp)

// Read
// Get a specific camp - get
router.get("/:id", isLoggedIn, campgrounds.getCamp)

// Update & Edit
// Edit
// Get the edit form to update a camp
router.get("/edit/:id", isLoggedIn, isAuthor, campgrounds.getEditForm)
// Update
router.put("/edit/:id", isLoggedIn, isAuthor, campgrounds.updateCampground)


// Delete
router.delete("/:id", isLoggedIn, isAuthor, campgrounds.deleteCampground)

module.exports = router;
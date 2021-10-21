const express = require("express")
const router = express.Router();

const CampGroundModel = require("../models/campground")
const {isLoggedIn, isAuthor} = require("../utils/middlewares") 

const passport = require("passport")
const LocalStrategy = require("passport-local") // Save locally


// get
// Show all camps
router.get("/", isLoggedIn, async (req, res) => {
    const camps = await CampGroundModel.find({})
    // console.log(camps)
    res.render('camps.ejs', {campgrounds: camps})
})

// Create & New
// New
// Create new camps page - get
router.get("/new", isLoggedIn, async (req, res) => {
    res.render("newCamp")
})
// Create
// Parse create new campground - post
router.post("/", isLoggedIn, async (req,res) => {
    console.log("Creating new camp:")
    console.log(req.body)
    const newCamp = new CampGroundModel({...req.body})
    newCamp.author = req.user._id;
    await newCamp.save()
    res.redirect("/camps")
})

// Read
// Get a specific camp - get
router.get("/:id", isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const chosenCamp = await CampGroundModel.findOne({_id: id}).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")
    console.log(chosenCamp)
    if (chosenCamp) {
        return res.render("showCamp", {camp: chosenCamp })
    } 
    console.log(`No camp with the id of ${id} was found...`)
    return res.redirect("/camps")
})

// Update & Edit
// Edit
// Get the edit form to update a camp
router.get("/edit/:id", isLoggedIn, isAuthor, async (req, res) => {
    const {id} = req.params;
    const editedCamp = await CampGroundModel.findById(id)
    res.render("editCamp", {camp: editedCamp})
})
// Update
router.put("/edit/:id", isLoggedIn, isAuthor, async (req, res) => {
    const {id} = req.params
    const editedCamp = await CampGroundModel.findByIdAndUpdate(id, {... req.body})
    res.redirect("/camps")
})


// Delete
router.delete("/:id", isLoggedIn, isAuthor, async (req, res) => {
    const {id} = req.params
    await CampGroundModel.findByIdAndDelete(id)
    res.redirect("/camps")
})

module.exports = router;
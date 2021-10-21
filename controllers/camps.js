const CampGroundModel = require("../models/campground")

module.exports.index = async (req, res) => {
    const camps = await CampGroundModel.find({})
    // console.log(camps)
    res.render('camps.ejs', {campgrounds: camps})
}

module.exports.newCampForm = async (req, res) => {
    res.render("newCamp")
}

module.exports.postNewCamp = async (req,res) => {
    console.log("Creating new camp:")
    console.log(req.body)
    const newCamp = new CampGroundModel({...req.body})
    newCamp.author = req.user._id;
    await newCamp.save()
    res.redirect("/camps")
}

module.exports.getCamp = async (req, res) => {
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
}

module.exports.getEditForm = async (req, res) => {
    const {id} = req.params;
    const editedCamp = await CampGroundModel.findById(id)
    res.render("editCamp", {camp: editedCamp})
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params
    const editedCamp = await CampGroundModel.findByIdAndUpdate(id, {... req.body})
    res.redirect("/camps")
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params
    await CampGroundModel.findByIdAndDelete(id)
    res.redirect("/camps")
}
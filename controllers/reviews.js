const ReviewModel = require("../models/review")
const CampGroundModel = require("../models/campground")

module.exports.createReview = async (req, res) => {
    console.log("Here we go")
    if (req.body.review == undefined) return;
    console.log(req.params)
    const ChosenReview = req.body.review
    console.log(ChosenReview)
    // if (ChosenReview.stars == undefined || ChosenReview.stars == undefined) return;
    console.log("Trying to add a review")
    console.log(ChosenReview)
    const NewReview = new ReviewModel(ChosenReview);
    NewReview.author = req.user._id
    const campground = await CampGroundModel.findById(req.params.id);
    campground.reviews.push(NewReview);
    await NewReview.save();
    await campground.save();
    res.redirect(`/camps/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    console.log("Attempting to delete " + id)
    const DeletedReview = await ReviewModel.findByIdAndDelete(reviewId)
    console.log(DeletedReview)
    res.redirect(`/camps/${id}`)
}
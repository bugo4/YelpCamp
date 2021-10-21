const express = require("express")
const router = express.Router({mergeParams: true})
const ReviewModel = require("../models/review")
const CampGroundModel = require("../models/campground")

const {isLoggedIn, isReviewAuthor} = require("../utils/middlewares") 



/* Reviews CRUD */
// Create
router.post("/", isLoggedIn, async (req, res) => {
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
})

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
    const { id, reviewId } = req.params;
    console.log("Attempting to delete " + id)
    const DeletedReview = await ReviewModel.findByIdAndDelete(reviewId)
    console.log(DeletedReview)
    res.redirect(`/camps/${id}`)
})

module.exports = router;
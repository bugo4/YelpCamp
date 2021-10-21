const express = require("express")
const router = express.Router({mergeParams: true})
const ReviewModel = require("../models/review")
const CampGroundModel = require("../models/campground")

const reviews = require("../controllers/reviews")

const {isLoggedIn, isReviewAuthor} = require("../utils/middlewares") 



/* Reviews CRUD */
// Create
router.post("/", isLoggedIn, reviews.createReview)

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
    const { id, reviewId } = req.params;
    console.log("Attempting to delete " + id)
    const DeletedReview = await ReviewModel.findByIdAndDelete(reviewId)
    console.log(DeletedReview)
    res.redirect(`/camps/${id}`)
})

module.exports = router;
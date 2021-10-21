const express = require("express")
const router = express.Router({mergeParams: true})
const ReviewModel = require("../models/review")
const CampGroundModel = require("../models/campground")

const reviews = require("../controllers/reviews")

const {isLoggedIn, isReviewAuthor} = require("../utils/middlewares") 



/* Reviews CRUD */
// Create
router.post("/", isLoggedIn, reviews.createReview)

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviews.deleteReview)

module.exports = router;
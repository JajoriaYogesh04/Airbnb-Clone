const express= require("express");
const router= express.Router({mergeParams: true});
const Listing= require("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/expressError.js");
const { reviewSchema} = require("../schema.js");
const Review= require("../models/review.js");
const { isLoggedIn, validateReview, isReviewAuthor }= require("../middleware.js"); 
const reviewController= require("../controllers/review.js")

// REVIEWS
// Post Review Route
router.post("/", isLoggedIn, validateReview, reviewController.createReview)

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.destroyReview)

module.exports= router;
const express= require("express");
const router= express.Router({mergeParams: true});
const Listing= require("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/expressError.js");
const { reviewSchema} = require("../schema.js");
const Review= require("../models/review.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    // console.log(error);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, errMsg));
    } else {
        next();
    }   
};

// REVIEWS
// Post Review Route
router.post("/", validateReview, wrapAsync(
    async(req, res)=>{
        req.flash("success", "Review Submitted!");
        let { id } = req.params;
        // console.log(id);
        let listing= await Listing.findById(id);
        if(!listing){
            req.flash("error", "Listing does not exist");
            res.redirect("/listing");
        }
        // console.log(listing);
        let reviewBody = req.body.review;
        console.log(reviewBody);
        let newReview= new Review(reviewBody);
        // console.log(newReview);
        listing.review.push(newReview);
        await listing.save();
        await newReview.save();
        // res.send("New Review Saved");
        console.log("New Review Saved");
        res.redirect(`/listing/${id}`);
    }
))

// Delete Review Route
router.delete("/:reviewId", wrapAsync(
    async(req, res)=>{
        req.flash("success", "Review Deleted!");
        let {id, reviewId}= req.params;
        // console.log(id);
        // console.log(reviewId);
        let deleteReview= await Review.findByIdAndDelete(reviewId);
        let reviewListing= await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
        console.log(deleteReview);
        console.log(reviewListing);
        res.redirect(`/listing/${id}`);
    }
))

module.exports= router;
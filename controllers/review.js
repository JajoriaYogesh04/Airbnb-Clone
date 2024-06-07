const Listing= require("../models/listing.js");
const Review= require("../models/review.js");
const wrapAsync= require("../utils/wrapAsync.js");

module.exports.createReview=  wrapAsync(
    async(req, res)=>{
        req.flash("success", "Review Submitted!");
        let { id } = req.params;
        // console.log(id);
        let listing= await Listing.findById(id);
        // console.log(listing);
        let reviewBody = req.body.review;
        reviewBody.author= req.user._id;
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
)

module.exports.destroyReview=  wrapAsync(
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
)
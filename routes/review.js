const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");


// Post Review Route
// listings/:id/reviews is replaced by '/'
router.post("/", 
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res, next)=>{
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id
        console.log("newReview",newReview);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        console.log("new review saved");
        req.flash("success", "New Review Created!")
        res.redirect(`/listings/${listing._id}`);

}))

// Delete Review Route

router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res)=>{
        let {id, reviewId} = req.params;
        // console.log("before delete");
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId} })
        await Review.findByIdAndDelete(reviewId);
        // console.log("after delete");
        req.flash("success", "Review Deleted!")
        res.redirect(`/listings/${id}`);
}))

module.exports = router;
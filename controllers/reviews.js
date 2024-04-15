const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next)=>{
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

}

module.exports.deleteReview = async (req, res)=>{
    let {id, reviewId} = req.params;
    // console.log("before delete");
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId} })
    await Review.findByIdAndDelete(reviewId);
    // console.log("after delete");
    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`);
}
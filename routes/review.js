const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/reviews.js");


// Post Review Route
// listings/:id/reviews is replaced by '/'
router.post("/", 
    isLoggedIn,
    validateReview,
    wrapAsync(createReview))

// Delete Review Route

router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(deleteReview))

module.exports = router;
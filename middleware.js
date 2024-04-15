const Listing = require("./models/listing");
const Review = require("./models/review");
const { reviewSchema, listingSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else{
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else{
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(`req.user: ${req.user}`);
  let {id, reviewId} = req.params;
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    // console.log("req.originalUrl:", req.originalUrl);
    // console.log(`listing id: ${id}, reviewId: ${reviewId}`);

    if(req.originalUrl === `/listings/${id}/reviews/${reviewId}?_method=DELETE`){
        req.flash("error", "you must be logged in to delete this listing's review!");
    }
    else{
        req.flash("error", "you must be logged in to create listing!");
    }
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

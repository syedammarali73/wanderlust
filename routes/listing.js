const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js")
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js")

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else{
        next();
    }
}

//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// New Route
router.get("/new", isLoggedIn, (req, res)=>{
    // console.log("req.user: ", req.user);
    return res.render("listings/new.ejs");
})    

// Show Route - /listings/:id  -> returns all data

router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Requested listing does not exists!")
        return res.redirect('/listings')
    }
    return res.render("listings/show.ejs", {listing})
}));

// Create Route
router.post("/", 
    isLoggedIn,
    validateListing, // middleware
    wrapAsync(async (req, res, next)=>{
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!")
    return res.redirect("/listings")
}));

// Edit & Update Route
// Get - /listings/:id/edit --> edit form
//                               🔻
// PUT - /listings              Submit
// Edit Route

router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "Requested listing does not exists!")
        return res.redirect('/listings')
    }
    return res.render("listings/edit.ejs", {listing})
}))

//Update Route
router.put("/:id",
    isLoggedIn,
    validateListing,
    wrapAsync( async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated!")
        return res.redirect(`/listings/${id}`);
  }));

// Delete Route

//Delete Route
// '/' --> listings
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    return res.redirect("/listings");
  }));


module.exports = router;
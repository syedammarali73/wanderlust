const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")


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
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
    .populate("owner");
    
    if(!listing){
        req.flash("error", "Requested listing does not exists!")
        return res.redirect('/listings')
    }
    // console.log(listing);
    return res.render("listings/show.ejs", {listing})
}));

// Create Route
router.post("/", 
    isLoggedIn,
    validateListing, // middleware
    wrapAsync(async (req, res, next)=>{
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
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
    isOwner,
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
    isOwner,
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
router.delete("/:id", 
    isLoggedIn,
    isOwner, 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    return res.redirect("/listings");
  }));


module.exports = router;
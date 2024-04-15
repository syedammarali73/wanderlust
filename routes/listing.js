const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, deleteListing } = require("../controllers/listings.js");


//Index Route
router.get("/", wrapAsync(index));

// New Route
router.get("/new", isLoggedIn, renderNewForm)    

// Show Route - /listings/:id  -> returns all data

router.get("/:id", wrapAsync(showListing));

// Create Route
router.post("/", 
    isLoggedIn,
    validateListing, // middleware
    wrapAsync(createListing));

// Edit & Update Route
// Get - /listings/:id/edit --> edit form
//                               🔻
// PUT - /listings              Submit
// Edit Route

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(renderEditForm))

//Update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(updateListing));

// Delete Route

//Delete Route
// '/' --> listings
router.delete("/:id", 
    isLoggedIn,
    isOwner, 
    wrapAsync(deleteListing));


module.exports = router;
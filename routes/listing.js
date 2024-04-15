const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, deleteListing } = require("../controllers/listings.js");


router.route("/")
.get(wrapAsync(index)) //Index Route

.post(                 // Create Route
    isLoggedIn,
    validateListing, 
    wrapAsync(createListing));          

// New Route
router.get("/new", isLoggedIn, renderNewForm)    


router.route("/:id")
.get(wrapAsync(showListing)) // Show Route - /listings/:id  -> returns all data
.put(               //Update Route
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(updateListing))

.delete(                //Delete Route   "/:id"--> listings
    isLoggedIn,
    isOwner, 
    wrapAsync(deleteListing));

// Edit
// Get - /listings/:id/edit --> edit form
//                               🔻
// PUT - /listings              Submit
// Edit Route

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(renderEditForm))


module.exports = router;
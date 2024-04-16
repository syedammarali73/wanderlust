const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res)=>{
    // console.log("req.user: ", req.user);
    return res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
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
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_fit,w_750/")
    
    return res.render("listings/show.ejs", {listing , originalImageUrl})
}

module.exports.createListing = async (req, res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(`url: ${url} .....filename: ${filename}`);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}
    await newListing.save();
    req.flash("success", "New Listing Created!")
    return res.redirect("/listings")
}

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "Requested listing does not exists!")
        return res.redirect('/listings')
    }
    
    let originalImageUrl = listing.image.url;
    https://res.cloudinary.com/dxlzhknzv/image/upload/c_fit,w_750/cld-sample.jpg
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_fit,w_250/")
    
    console.log("originalImageUrl",originalImageUrl);
    return res.render("listings/edit.ejs", {listing, originalImageUrl})
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename}
        await listing.save();
    }
    req.flash("success", "Listing Updated!")
    return res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    return res.redirect("/listings");
  }
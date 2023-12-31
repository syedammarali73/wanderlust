const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: `https://unsplash.com/photos/landmark-photography-of-trees-near-rocky-mountain-under-blue-skies-daytime-ndN00KmbJ1c`,
        set: (v) => v === "" ? "https://unsplash.com/photos/landmark-photography-of-trees-near-rocky-mountain-under-blue-skies-daytime-ndN00KmbJ1c" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
})

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
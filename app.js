const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

main()
.then(res => console.log("Connect to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

app.get("/", (req, res)=>{
    res.send("Hi, I am root")
})


app.use("/listings", listings);
app.use('/listings/:id/reviews', reviews)

// app.get("/testListing", async (req, res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     })

//     await sampleListing.save();
//     console.log("sample was saved");

//     res.send("successful")
// })

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next)=>{
    let {statusCode = 500, message= "something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err})
    // res.status(statusCode).send(message);
})

app.listen(port, ()=>{
    console.log(`server is listening to port: ${port}`);
})
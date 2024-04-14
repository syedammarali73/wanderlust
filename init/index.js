const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")
const dotenv = require("dotenv");
dotenv.config({
    path: './.env'
});


const MONGO_URL = process.env.MONGO_URI;
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})


const initDB = async () =>{
    async function main() {
        await mongoose.connect(MONGO_URL);
      }
      
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was iitialized");
}

initDB();